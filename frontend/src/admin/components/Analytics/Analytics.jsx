import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiBarChartSquare } from "react-icons/bi";
import PageWapper from "../../../components/layout/PageWapper";
import { paymentDataFetchAPI } from "../../features/payment/paymentThunk";
import { ProductGet } from "../../features/productAdd/productAddThunk";
import { getOrderAPI } from "../../../features/orders/orderThunk";
import { fetchUserAPI } from "../../features/user/userThunk";
import AnalyticsCards from "./AnalyticsCards";
import BreakdownBars from "./BreakdownBars";
import PaymentTable from "./PaymentTable";
import ReportChart from "./ReportChart";
import RevenueReport from "./RevenueReport";

const countBy = (items, key) =>
  items.reduce((acc, item) => {
    const value = item?.[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const EMPTY_LIST = [];

const Analytics = () => {
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payment?.paymentData) ?? EMPTY_LIST;
  const paymentLoading = useSelector((state) => state.payment?.loading);
  const products = useSelector((state) => state.productAdd?.products) ?? EMPTY_LIST;
  const orders = useSelector((state) => state.orders?.order) ?? EMPTY_LIST;
  const users = useSelector((state) => state.user?.users) ?? EMPTY_LIST;

  useEffect(() => {
    dispatch(paymentDataFetchAPI());
    dispatch(ProductGet());
    dispatch(getOrderAPI());
    dispatch(fetchUserAPI());
  }, [dispatch]);

  const stats = useMemo(() => {
    const productList = Array.isArray(products) ? products : [];
    const orderList = Array.isArray(orders) ? orders : [];
    const paymentList = Array.isArray(payments) ? payments : [];
    const userList = Array.isArray(users) ? users : [];

    const netRevenue = paymentList.reduce((sum, item) => {
      if (item.status === "failed") return sum;
      return sum + Number(item.amount_paid || 0) - Number(item.amount_refunded || 0);
    }, 0);

    return {
      netRevenue,
      orderCount: orderList.length,
      customerCount: userList.filter((user) => user.role !== "admin").length,
      productCount: productList.length,
      lowStock: productList.filter((item) => item.qty > 0 && item.qty <= 10).length,
      outOfStock: productList.filter((item) => !item.qty || item.qty <= 0).length,
      successPayments: paymentList.filter((item) => item.status === "success").length,
    };
  }, [payments, products, orders, users]);

  const orderStatus = useMemo(() => countBy(orders, "status"), [orders]);
  const paymentStatus = useMemo(() => countBy(payments, "status"), [payments]);
  const paymentMethod = useMemo(() => countBy(payments, "method"), [payments]);
  const categoryStock = useMemo(() => {
    return (Array.isArray(products) ? products : []).reduce((acc, item) => {
      const name = item.category || "Uncategorized";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  return (
    <div className="w-full min-h-full flex justify-center items-start ">
      <PageWapper className="h-full w-full px-4 py-5 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-[#eaf4ff] px-5 py-6 text-[#172033] shadow-[0_12px_30px_rgba(37,99,235,0.08)] sm:px-7">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700">
                Business report / live overview
              </p>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight max-[600px]:text-2xl">
                <BiBarChartSquare className="text-blue-600" />
                <span>Analytics</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                Keep a close eye on revenue, customers, inventory, and payment health.
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-left shadow-sm sm:min-w-44">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Reporting status
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]" />
                Live store data
              </p>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-2/5 opacity-60 [background-image:linear-gradient(rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(90deg,transparent,black)]" />
        </section>

        <div className="mt-5">
          <AnalyticsCards stats={stats} />
        </div>

        <RevenueReport payments={payments} orders={orders} />

        <div className="mt-5 overflow-hidden rounded-xl">
          <ReportChart orderStatus={orderStatus} paymentStatus={paymentStatus} />
        </div>

        <div className="mt-7 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Store signals
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#172033]">
              What is moving your business
            </h2>
          </div>
          <p className="hidden text-xs text-slate-500 sm:block">Updated from your latest records</p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <BreakdownBars title="Orders by status" data={orderStatus} />
          <BreakdownBars title="Payments by status" data={paymentStatus} />
          <BreakdownBars title="Payments by method" data={paymentMethod} />
          <BreakdownBars title="Products by category" data={categoryStock} />
        </div>

        <div className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(23,32,51,0.05)]">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">Cash flow</p>
              <h3 className="mt-1 font-bold text-[#172033]">Recent payments</h3>
            </div>
            <p className="text-xs text-slate-400">Latest 12 transactions</p>
          </div>
          {paymentLoading && !payments.length ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading payments...</p>
          ) : (
            <div className="px-5 py-2">
              <PaymentTable payments={payments.slice(0, 12)} />
            </div>
          )}
        </div>
      </PageWapper>
    </div>
  );
};

export default Analytics;
