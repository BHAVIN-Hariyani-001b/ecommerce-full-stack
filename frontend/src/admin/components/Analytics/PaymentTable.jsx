import Chip from "@mui/material/Chip";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const STATUS_COLOR = {
  success: "success",
  pending: "warning",
  failed: "error",
  refunded: "default",
};

const PaymentTable = ({ payments = [] }) => {
  if (!payments.length) {
    return (
      <p className="text-sm text-gray-400 py-6 text-center">
        No payment records found
      </p>
    );
  }

  return (
    <div className="max-h-80 overflow-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="border-b border-slate-200 text-[10px] uppercase tracking-[0.12em] text-slate-400">
          <tr>
            <th className="py-2 pr-3 font-medium">Payment</th>
            <th className="py-2 pr-3 font-medium">Method</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            <th className="py-2 pr-3 font-medium">Amount</th>
            <th className="py-2 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="py-3 pr-3 font-bold text-[#172033]">
                {item.id ? `#${String(item.id).slice(0, 8).toUpperCase()}` : "—"}
              </td>
              <td className="py-3 pr-3 uppercase text-slate-600">
                {item.method || "—"}
              </td>
              <td className="py-2.5 pr-3">
                <Chip
                  size="small"
                  label={item.status || "unknown"}
                  color={STATUS_COLOR[item.status] || "default"}
                />
              </td>
              <td className="py-3 pr-3 font-semibold text-[#172033]">{formatCurrency(item.amount_paid)}</td>
              <td className="py-3 text-slate-500">
                {formatDate(item.paid_at || item.create_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
