import { useEffect, useState } from 'react'
import { apiBase, toList } from '../api'
import DataTable from './DataTable'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'durationMinutes', label: 'Duration (min)' },
]

export default function Workouts() {
  const [state, setState] = useState({ items: [], error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${apiBase}/api/workouts/`, { signal: controller.signal })
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

  return <DataTable title="Workouts" columns={columns} {...state} />
}
