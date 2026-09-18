import type { SearchItems } from "../domain/search-items"

const items = [
  'react', 'redux', 'react-query', 'react-router', 'recoil',
  'remix', 'rxjs', 'rust', 'ruby', 'rails',
]

export const remoteSearchItems: SearchItems = (query, signal) => {
  const delay = 300 + Math.random() * 900

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve(items.filter((item) => item.includes(query.toLowerCase())))
    }, delay)

    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}
