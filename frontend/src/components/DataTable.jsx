export default function DataTable({ columns, data, emptyMessage = 'No data found.' }) {
  return (
    <div className="overflow-x-auto">
      {/* Desktop table */}
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="border-b border-bna-border">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 text-bna-secondary font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-8 text-bna-secondary">{emptyMessage}</td></tr>
          ) : data.map((row, i) => (
            <tr key={i} className="border-b border-bna-border hover:bg-bna-black/50">
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 text-white">
                  {col.render ? col.render(row) : row[col.key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <p className="text-center py-8 text-bna-secondary">{emptyMessage}</p>
        ) : data.map((row, i) => (
          <div key={i} className="bg-bna-dark border border-bna-border rounded-lg p-4 space-y-2">
            {columns.map(col => (
              <div key={col.key} className="flex justify-between text-sm">
                <span className="text-bna-secondary">{col.label}</span>
                <span className="text-white text-right">{col.render ? col.render(row) : row[col.key] ?? '-'}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
