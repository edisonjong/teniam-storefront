"use client"

import type * as React from "react"
import { useState } from "react"
import { Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FeedbackDialogProps {
  children: React.ReactNode
}

export function FeedbackDialog({ children }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedbackType, setFeedbackType] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const feedbackTypes = [
    { id: "bug", label: "Bug Report" },
    { id: "feature", label: "Feature Request" },
    { id: "improvement", label: "Improvement" },
    { id: "other", label: "Other" },
  ]

  const handleSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log({ rating, feedbackType, message })
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      // Reset form after closing
      setTimeout(() => {
        setRating(0)
        setFeedbackType(null)
        setMessage("")
        setSubmitted(false)
      }, 200)
    }, 2000)
  }

  const isValid = rating > 0 && feedbackType && message.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Share your feedback</DialogTitle>
              <DialogDescription>Help us improve your experience. Your feedback matters to us.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">How would you rate your experience?</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "size-8 transition-colors",
                          (hoveredRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">What type of feedback do you have?</label>
                <div className="flex flex-wrap gap-2">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-all",
                        feedbackType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80",
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tell us more</label>
                <Textarea
                  placeholder="Share your thoughts, suggestions, or report an issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={!isValid} className="gap-2">
                <Send className="size-4" />
                Submit Feedback
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="size-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Thank you for your feedback!</h3>
            <p className="mt-2 text-sm text-muted-foreground">We appreciate you taking the time to help us improve.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
