"use client";

import { useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";

const STORAGE_KEY = "mercur-regions";

type UseRegionsResult = {
  regions: HttpTypes.StoreRegion[];
  loading: boolean;
  error: string | null;
};

export function useRegions(): UseRegionsResult {
  const [regions, setRegions] = useState<HttpTypes.StoreRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const readCache = () => {
      if (typeof window === "undefined") {
        return null;
      }

      const cached = window.sessionStorage.getItem(STORAGE_KEY);
      if (!cached) {
        return null;
      }

      try {
        const parsed = JSON.parse(cached) as HttpTypes.StoreRegion[];
        return Array.isArray(parsed) ? parsed : null;
      } catch (error) {
        window.sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }
    };

    const cachedRegions = readCache();

    if (cachedRegions && cachedRegions.length > 0) {
      setRegions(cachedRegions);
      setLoading(false);
    }

    const fetchRegions = async () => {
      try {
        const response = await fetch("/api/regions", {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to load regions");
        }

        const data: { regions?: HttpTypes.StoreRegion[] } = await response.json();
        const nextRegions = data?.regions ?? [];
        if (!mounted) {
          return;
        }

        setRegions(nextRegions);
        try {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextRegions));
        } catch {
          // ignore storage errors
        }
      } catch (err: any) {
        if (!mounted) {
          return;
        }
        console.error("useRegions:", err);
        setError(err?.message ?? "Failed to load regions");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRegions();

    // Listen for cross-tab region changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newRegions = JSON.parse(e.newValue) as HttpTypes.StoreRegion[];
          if (Array.isArray(newRegions) && mounted) {
            setRegions(newRegions);
          }
        } catch (error) {
          // Ignore parsing errors
        }
      }
    };

    // Listen for cross-tab region change notifications
    const broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('region-changes') : null;
    
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data.type === 'REGION_CHANGED' && mounted) {
        // Re-fetch regions to get the latest data
        fetchRegions();
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcastMessage);
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mounted = false;
      controller.abort();
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcastMessage);
        broadcastChannel.close();
      }
    };
  }, []);

  return { regions, loading, error };
}
