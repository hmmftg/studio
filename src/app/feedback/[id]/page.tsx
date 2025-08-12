"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, ThumbsUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true)
  }

  if (submitted) {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center animate-in fade-in-50 zoom-in-95">
                <CardContent className="p-8">
                    <ThumbsUp className="mx-auto h-16 w-16 text-primary mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
                    <p className="text-muted-foreground mb-6">Your feedback has been submitted. We appreciate your time.</p>
                    <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    )
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Share Your Feedback</CardTitle>
          <CardDescription>How was your experience today? Let us know so we can improve.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-2 block">Your Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-all",
                        rating >= star ? "text-primary fill-primary" : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comments" className="mb-2 block">Comments (Optional)</Label>
              <Textarea id="comments" placeholder="Tell us more about your experience..." rows={4} />
            </div>
            <Button type="submit" className="w-full !mt-8">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
