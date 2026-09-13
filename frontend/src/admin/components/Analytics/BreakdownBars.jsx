const BreakdownBars = ({ title, data = {}, emptyLabel = "No data" }) => {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, value]) => Number(value) || 0), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(23,32,51,0.045)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-bold text-[#172033]">{title}</h3>
        <span className="h-2 w-2 rounded-full bg-cyan-400" />
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([label, value]) => {
            const count = Number(value) || 0;
            const width = `${Math.round((count / max) * 100)}%`;
            return (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span className="capitalize">{label}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BreakdownBars;
