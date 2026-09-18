import { useEffect, useState } from 'react'
import type { SearchItems } from '../domain/search-items'


type Status = 'idle' | 'loading' | 'success' | 'error'

export function useSearch(searchItems: SearchItems) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (query.trim() === '') {
      setStatus('idle')
      setResults([])
      return
    }

    const controller = new AbortController()
    const debounceTimer = setTimeout(() => {
      setStatus('loading')

      searchItems(query, controller.signal)
        .then((data) => {
          setResults(data)
          setStatus('success')
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setStatus('error')
          }
        })
    }, 400)

    return () => {
      clearTimeout(debounceTimer)
      controller.abort()
    }
  }, [query, searchItems])

  return { query, setQuery, results, status }
}