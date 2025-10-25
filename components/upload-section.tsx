"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function UploadSection() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleFile(file)
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [])

  const handleFile = async (file: File) => {
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload and analyze
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()

      // Navigate to results page with session ID
      router.push(`/session/${data.sessionId}`)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to analyze dog photo. Please try again.")
      setIsUploading(false)
      setPreview(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Begin Your Dog's Journey to Wellness
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Upload a photo of your dog to receive a comprehensive behavioral and psychological evaluation
        </p>
      </div>

      <Card className="overflow-hidden border-2 border-dashed border-border bg-card">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative p-12 text-center transition-colors ${isDragging ? "bg-accent/50" : "bg-card"}`}
        >
          {preview ? (
            <div className="space-y-6">
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-lg">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Dog photo preview"
                  className="h-full w-full object-cover"
                />
              </div>

              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium text-foreground">Conducting behavioral evaluation...</p>
                  <p className="text-xs text-muted-foreground">
                    Analyzing temperament, emotional state, and behavioral patterns
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4 space-y-2">
                <p className="text-lg font-semibold text-foreground">Drop your dog's photo here</p>
                <p className="text-sm text-muted-foreground">or click to browse your files</p>
              </div>
              <div className="mt-6">
                <label htmlFor="file-upload">
                  <Button
                    type="button"
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Select Photo
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Accepts JPG, PNG, or WebP up to 10MB</p>
            </>
          )}
        </div>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold text-primary">100%</p>
          <p className="mt-1 text-sm text-muted-foreground">Confidential</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold text-primary">AI-Powered</p>
          <p className="mt-1 text-sm text-muted-foreground">Advanced Analysis</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold text-primary">Instant</p>
          <p className="mt-1 text-sm text-muted-foreground">Results</p>
        </div>
      </div>
    </div>
  )
}
