"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string
  lowQualitySrc?: string
  loadingClassName?: string
  errorClassName?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  lowQualitySrc,
  loadingClassName = "animate-pulse bg-muted",
  errorClassName = "bg-muted",
  className = "",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)

  // Reset loading and error states when src changes
  useEffect(() => {
    setIsLoading(true)
    setError(false)
    setCurrentSrc(lowQualitySrc || src)
  }, [src, lowQualitySrc])

  const handleLoad = () => {
    // If we're using a low quality placeholder, switch to the high quality image
    if (lowQualitySrc && currentSrc === lowQualitySrc) {
      setCurrentSrc(src)
    } else {
      setIsLoading(false)
    }
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
    setCurrentSrc(fallbackSrc)
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={props.style}>
      <Image
        {...props}
        src={error ? fallbackSrc : currentSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? `opacity-0 ${loadingClassName}` : "opacity-100"
        } ${error ? errorClassName : ""} ${props.className || ""}`}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && <div className={`absolute inset-0 ${loadingClassName}`} style={{ backdropFilter: "blur(10px)" }} />}
    </div>
  )
}
