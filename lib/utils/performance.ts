// Debounce function to limit the rate at which a function can fire
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }
}

// Throttle function to limit the number of times a function can be called
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Memoize function to cache expensive function calls
export function memoize<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>()

  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>
    }

    const result = func(...args)
    cache.set(key, result)

    return result
  }
}

// Function to measure execution time
export function measureExecutionTime<T extends (...args: any[]) => any>(
  func: T,
  funcName: string = func.name,
): (...args: Parameters<T>) => ReturnType<T> {
  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    const start = performance.now()
    const result = func(...args)
    const end = performance.now()

    console.log(`${funcName} execution time: ${end - start}ms`)

    return result
  }
}

// Function to chunk array operations for better performance
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }

  return chunks
}

// Function to process large arrays in chunks to avoid UI blocking
export async function processInChunks<T, U>(
  items: T[],
  processor: (item: T) => U,
  chunkSize = 100,
  delay = 0,
): Promise<U[]> {
  const chunks = chunkArray(items, chunkSize)
  const results: U[] = []

  for (const chunk of chunks) {
    const chunkResults = chunk.map(processor)
    results.push(...chunkResults)

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    } else {
      // Yield to the event loop to prevent UI blocking
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return results
}
