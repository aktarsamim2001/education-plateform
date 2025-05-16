"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseApiOptions<T> {
  url: string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: any
  headers?: HeadersInit
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
  refetchInterval?: number
  cacheTime?: number
}

interface UseApiResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  mutate: (newData: T) => void
}

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>()

export function useApi<T = any>({
  url,
  method = "GET",
  body,
  headers,
  initialData,
  onSuccess,
  onError,
  enabled = true,
  refetchInterval,
  cacheTime = 5 * 60 * 1000, // 5 minutes default cache time
}: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  // Use refs for values that shouldn't trigger re-renders
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Update refs when props change
  useEffect(() => {
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [onSuccess, onError])

  const fetchData = useCallback(async () => {
    // Skip if disabled
    if (!enabled) return

    // Check cache first for GET requests
    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`
    if (method === "GET" && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey)!
      const now = Date.now()

      if (now - cachedData.timestamp < cacheTime) {
        setData(cachedData.data)
        onSuccessRef.current?.(cachedData.data)
        return
      }
    }

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new abort controller
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Update cache for GET requests
      if (method === "GET") {
        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        })
      }

      setData(result)
      setIsLoading(false)
      onSuccessRef.current?.(result)

      return result
    } catch (err) {
      // Ignore abort errors
      if ((err as Error).name === "AbortError") return

      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      setIsLoading(false)
      onErrorRef.current?.(error)

      throw error
    }
  }, [url, method, body, headers, enabled, cacheTime])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Set up refetch interval if specified
  useEffect(() => {
    if (!refetchInterval || !enabled) return

    const intervalId = setInterval(fetchData, refetchInterval)

    return () => clearInterval(intervalId)
  }, [fetchData, refetchInterval, enabled])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Function to manually update the data
  const mutate = useCallback((newData: T) => {
    setData(newData)
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    mutate,
  }
}
