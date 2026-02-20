import { NextRequest, NextResponse } from "next/server"
import { listRegions } from "@/lib/data/regions"

export async function GET(request: NextRequest) {
  try {
    const regions = await listRegions()
    
    return NextResponse.json({ 
      regions 
    })
  } catch (error: any) {
    console.error("API regions error:", error)
    return NextResponse.json(
      { 
        error: error?.message || "Failed to fetch regions",
        regions: []
      },
      { status: 500 }
    )
  }
}