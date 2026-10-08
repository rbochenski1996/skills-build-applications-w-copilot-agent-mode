import { useEffect, useState } from 'react'
import { apiBase, toList } from '../api'
import DataTable from './DataTable'

const columns = [
  { key: 'user', label: 'User' },
  { key: 'type', label: 'Type' },
  { key: 'durationMinutes', label: 'Duration (min)' },
  { key: 'calories', label: 'Calories' },
  { key: 'date', label: 'Date' },
]

export default function Activities() {
  const [state, setState] = useState({ items: [], error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${apiBase}/api/activities/`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        return res.json()
      })
      .then((data) => setState({ items: toList(data), error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ items: [], error: error.message, loading: false })
      })
    return () => controller.abort()
  }, [])

  return <DataTable title="Activities" columns={columns} {...state} />
}
