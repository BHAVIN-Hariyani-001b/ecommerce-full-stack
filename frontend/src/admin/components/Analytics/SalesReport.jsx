import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TbCash } from "react-icons/tb";
import PageWapper from "../../../components/layout/PageWapper";
import { paymentReportDataGetAPI } from "../../features/payment/paymentThunk";
import MathOverviewCard from "../MathOverviewCard";
import BreakdownBars from "./BreakdownBars";
import PaymentTable from "./PaymentTable";
import PaymentReportFilters from "./PaymentReportFilters";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const SalesReport = () => {
  const dispatch = useDispatch();
  const report = useSelector((state) => state.payment?.paymentReport);
  const loading = useSelector((state) => state.payment?.loading);
  const error = useSelector((state) => state.payment?.error);

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
    method: "",
  });

  const loadReport = useCallback(
    (nextFilters = filters) => {
      dispatch(paymentReportDataGetAPI({ ...nextFilters, limit: 50 }))
      .unwrap()
        .catch((err) => toast.error(err || "Failed to load payment report"));
    },
    [dispatch, filters],
  );

  useEffect(() => {
    loadReport({ limit: 50 });
  }, [loadReport]);

  const summary = report?.summary ?? {};
  const paymentRows = report?.payment_data ?? [];
  const cards = [
    { title: "Records", value: summary.total_records, icon: <TbCash /> },
    { title: "Amount paid", value: formatCurrency(summary.total_amount_paid), icon: <TbCash /> },
    { title: "Refunded", value: formatCurrency(summary.total_amount_refunded), icon: <TbCash /> },
    { title: "Net revenue", value: formatCurrency(summary.net_revenue), icon: <TbCash /> },
  ];

  return (
    <div className="flex min-h-full w-full justify-center">
      <PageWapper className="h-full w-full px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Finance / payment intelligence
            </p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight text-[#172033] max-[600px]:text-2xl">
              <TbCash className="text-blue-600" />
              <span>Sales report</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500">Measure revenue across every payment.</p>
        </header>

        <PaymentReportFilters
          filters={filters}
          onChange={setFilters}
          onSubmit={() => loadReport(filters)}
          loading={loading}
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="my-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {cards.map((card) => (
            <MathOverviewCard
              key={card.title}
              title={card.title}
              description={typeof card.value === "number" ? String(card.value ?? 0) : card.value}
              icon={card.icon}
            />
          ))}
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <BreakdownBars title="By status" data={summary.by_status || {}} />
          <BreakdownBars title="By method" data={summary.by_method || {}} />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(23,32,51,0.05)]">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">Transactions</p>
            <h3 className="mt-1 font-bold text-[#172033]">Payment records</h3>
          </div>
          {loading && !paymentRows.length ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading report...</p>
          ) : (
            <div className="px-5 py-2">
              <PaymentTable payments={paymentRows} />
            </div>
          )}
        </div>
      </PageWapper>
    </div>
  );
};

export default SalesReport;
