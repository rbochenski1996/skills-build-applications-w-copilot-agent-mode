const display = (value) =>
  value === null || value === undefined
    ? ''
    : typeof value === 'object'
      ? JSON.stringify(value)
      : String(value)

export default function DataTable({ title, columns, items, error, loading }) {
  return (
    <section>
      <h2 className="mb-3">{title}</h2>
      {loading && <p>Loading…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-muted">
                    No records found.
                  </td>
                </tr>
              )}
              {items.map((item, i) => (
                <tr key={item._id ?? item.id ?? i}>
                  {columns.map((c) => (
                    <td key={c.key}>{display(item[c.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
