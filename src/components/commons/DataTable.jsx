// src/components/DataTable.jsx

/**
 * DataTable
 * Tableau générique avec colonnes configurables.
 *
 * columns      : { key, header, render: (row) => ReactNode, width? }[]
 * data         : T[]
 * keyExtractor : (row) => string
 * onRowClick   : (row) => void
 * isLoading    : affiche skeleton rows
 * emptyState   : ReactNode
 */
export function DataTable({
  columns = [],
  data = [],
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyState,
  className = "",
}) {
  return (
    <div className={`overflow-x-auto font-[family-name:var(--font-body)] ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-sl-50">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className="
                  px-[14px] py-[10px] text-left text-[11px] font-bold
                  tracking-[0.08em] uppercase text-sl-500
                  border-b border-sl-200 whitespace-nowrap
                "
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="border-b border-sl-100">
              {columns.map((col) => (
                <td key={col.key} className="px-[14px] py-3">
                  <div
                    className="sl-animate-shimmer h-3 rounded-[var(--radius-sm)]"
                    style={{ width: "70%" }}
                  />
                </td>
              ))}
            </tr>
          ))}

          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-[14px] py-10 text-center">
                {emptyState ?? (
                  <span className="text-[14px] text-sl-400">Aucune donnée</span>
                )}
              </td>
            </tr>
          )}

          {!isLoading && data.map((row) => {
            const key = keyExtractor ? keyExtractor(row) : row.id;
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-sl-100 transition-colors duration-100
                  hover:bg-sl-50
                  ${onRowClick ? "cursor-pointer active:bg-sl-100" : ""}
                `}
              >
                
                {columns.map((col) => (
                  <td key={col.key} className="px-[14px] py-3 text-[13px] text-sl-700">
                    {typeof col.render === "function"
                      ? col.render(row)
                      : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
