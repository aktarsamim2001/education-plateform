"use client"

import type React from "react"

import { useEffect } from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, X, Upload, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  onUpload?: (file: File) => Promise<string>
  accept?: Record<string, string[]>
  maxSize?: number
  disabled?: boolean
  label?: string
}

export function FileUpload({
  value,
  onChange,
  onUpload,
  accept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  label = "Upload a file",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  // Extract filename from URL
  useEffect(() => {
    if (value) {
      const parts = value.split("/")
      setFileName(parts[parts.length - 1])
    } else {
      setFileName("")
    }
  }, [value])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return

      const file = acceptedFiles[0]
      if (!file) return

      try {
        setIsUploading(true)
        setError(null)
        setFileName(file.name)

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
        console.error("Error uploading file:", err)
        setError("Failed to upload file. Please try again.")
        setFileName("")
      } finally {
        setIsUploading(false)
      }
    },
    [disabled, onChange, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled: isUploading || disabled,
    onDropRejected: (rejections) => {
      if (rejections[0]?.errors[0]?.code === "file-too-large") {
        setError(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB.`)
      } else {
        setError("Invalid file type. Please upload a supported file format.")
      }
    },
  })

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange("")
      setFileName("")
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

      {value && fileName ? (
        <div className="flex w-full items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{fileName}</div>
          {!disabled && (
            <Button type="button" variant="ghost" size="icon" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">Drag & drop a file here, or click to select</div>
        </div>
      )}

      {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
    </div>
  )
}
