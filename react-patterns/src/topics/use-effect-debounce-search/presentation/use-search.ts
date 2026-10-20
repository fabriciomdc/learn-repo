import { useEffect, useState } from 'react'
import type { SearchItems } from '../domain/search-items'


type Status = 'idle' | 'loading' | 'success' | 'error'

export function useSearch(searchItems: SearchItems) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')

  function changeQuery(value: string) {
    setQuery(value)

    if (value.trim() === '') {
      setStatus('idle')
      setResults([])
    }
  }

  useEffect(() => {
    if (query.trim() === '') return

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

  return { query, setQuery: changeQuery, results, status }
}