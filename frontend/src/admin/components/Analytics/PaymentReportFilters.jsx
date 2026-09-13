const STATUS_OPTIONS = [
  { value: "", label: "All status" },
  { value: "pending", label: "Pending" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const METHOD_OPTIONS = [
  { value: "", label: "All methods" },
  { value: "cod", label: "COD" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
];

const fieldClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const PaymentReportFilters = ({ filters, onChange, onSubmit, loading }) => {
  const updateFilter = (field) => (event) => {
    onChange({ ...filters, [field]: event.target.value });
  };

  return (
    <form
      className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(23,32,51,0.045)] sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          From
        </span>
        <input
          type="date"
          value={filters.start_date}
          onChange={updateFilter("start_date")}
          className={fieldClassName}
        />
      </label>
      <label className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          To
        </span>
        <input
          type="date"
          value={filters.end_date}
          onChange={updateFilter("end_date")}
          className={fieldClassName}
        />
      </label>
      <label className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Status
        </span>
        <select
          value={filters.status}
          onChange={updateFilter("status")}
          className={fieldClassName}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || "all-status"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Method
        </span>
        <select
          value={filters.method}
          onChange={updateFilter("method")}
          className={fieldClassName}
        >
          {METHOD_OPTIONS.map((option) => (
            <option key={option.value || "all-methods"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="h-11 self-end rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Loading..." : "Apply filters"}
      </button>
    </form>
  );
};

export default PaymentReportFilters;
