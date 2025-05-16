"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onUpload?: (file: File) => Promise<string>
  disabled?: boolean
}

export function ImageUpload({ value, onChange, onUpload, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return

      const file = acceptedFiles[0]
      if (!file) return

      try {
        setIsUploading(true)
        setError(null)

        if (onUpload) {
          const url = await onUpload(file)
          onChange(url)
        } else {
          // If no upload function is provided, create a local object URL
          // Note: This is just for preview and won't persist
          const localUrl = URL.createObjectURL(file)
          onChange(localUrl)
        }
      } catch (err) {
        console.error("Error uploading image:", err)
        setError("Failed to upload image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    },
    [disabled, onChange, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: isUploading || disabled,
  })

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange("")
    },
    [onChange],
  )

  return (
    <div
      {...getRootProps()}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition hover:bg-muted/50 ${
        isDragActive ? "bg-muted/50" : ""
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <input {...getInputProps()} />

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm font-medium">Drag & drop an image here, or click to select</div>
          <div className="text-xs text-muted-foreground">Recommended size: 1280x720px (16:9)</div>
        </div>
      )}

      {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
    </div>
  )
}
