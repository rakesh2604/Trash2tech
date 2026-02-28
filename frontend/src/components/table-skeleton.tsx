type TableSkeletonProps = {
  rows?: number;
  cols?: number;
};

export function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 animate-pulse">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-3">
                <div className="h-4 bg-slate-700 rounded w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-t border-slate-800">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx} className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-full max-w-24" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
