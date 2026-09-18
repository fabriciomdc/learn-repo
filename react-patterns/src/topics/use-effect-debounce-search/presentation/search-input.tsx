import { remoteSearchItems } from '../data/remote-search-items'
import { useSearch } from './use-search'

export function SearchInput() {
  const { query, setQuery, results, status } = useSearch(remoteSearchItems)

  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="buscar biblioteca..."
      />
      {status === 'loading' && <p>carregando...</p>}
      {status === 'error' && <p>algo deu errado</p>}
      {status === 'success' && results.length === 0 && <p>nada encontrado</p>}
      {status === 'success' && (
        <ul>
          {results.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}