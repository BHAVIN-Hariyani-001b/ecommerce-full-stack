import { useMemo, useState } from "react";
import { LineChart, PieChart } from "@mui/x-charts";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const CHART_COLORS = ["#2563eb", "#0f766e", "#f59e0b", "#dc2626", "#64748b"];

const getDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const getPeriodKey = (value, period) => {
  const dateKey = getDateKey(value);
  return dateKey ? (period === "month" ? dateKey.slice(0, 7) : dateKey) : null;
};

const formatPeriod = (key, period) => {
  const date = new Date(`${key}${period === "month" ? "-01" : ""}T00:00:00`);
  return date.toLocaleDateString("en-IN", period === "month"
    ? { month: "short", year: "2-digit" }
    : { day: "numeric", month: "short" });
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const RevenueReport = ({ payments = [], orders = [] }) => {
  const [period, setPeriod] = useState("day");
  const { periods, revenue, orderCount, statusData } = useMemo(() => {
    const revenueByPeriod = {};
    const ordersByPeriod = {};
    const statusCounts = {};

    payments.forEach((payment) => {
      const status = payment.status || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      if (status === "failed") return;
      const key = getPeriodKey(payment.paid_at || payment.create_at, period);
      if (!key) return;
      revenueByPeriod[key] =
        (revenueByPeriod[key] || 0) +
        Number(payment.amount_paid || 0) -
        Number(payment.amount_refunded || 0);
    });

    orders.forEach((order) => {
      const key = getPeriodKey(order.create_at, period);
      if (key) ordersByPeriod[key] = (ordersByPeriod[key] || 0) + 1;
    });

    const periodKeys = Array.from(
      new Set([...Object.keys(revenueByPeriod), ...Object.keys(ordersByPeriod)]),
    ).sort().slice(-(period === "month" ? 6 : 14));
    return {
      periods: periodKeys.map((key) => formatPeriod(key, period)),
      revenue: periodKeys.map((key) => revenueByPeriod[key] || 0),
      orderCount: periodKeys.map((key) => ordersByPeriod[key] || 0),
      statusData: Object.entries(statusCounts).map(([label, value], index) => ({
        id: label,
        label,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })),
    };
  }, [payments, orders, period]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 mt-5">
      <Paper elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, p: 2.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
              Revenue and orders
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Daily activity or the last six months
            </Typography>
          </Box>
          <ButtonGroup size="small" variant="outlined" aria-label="Report period">
            <Button onClick={() => setPeriod("day")} variant={period === "day" ? "contained" : "outlined"}>
              Daily
            </Button>
            <Button onClick={() => setPeriod("month")} variant={period === "month" ? "contained" : "outlined"}>
              Monthly
            </Button>
          </ButtonGroup>
        </Stack>
        {periods.length ? (
          <LineChart
            height={280}
            margin={{ top: 24, right: 20, bottom: 36, left: 58 }}
            xAxis={[{ scaleType: "point", data: periods, tickLabelStyle: { fontSize: 12 } }]}
            yAxis={[
              { id: "revenue", valueFormatter: formatCurrency, tickLabelStyle: { fontSize: 11 } },
              { id: "orders", position: "right", tickLabelStyle: { fontSize: 11 } },
            ]}
            series={[
              { data: revenue, label: "Revenue", color: "#2563eb", area: true, showMark: true, yAxisId: "revenue" },
              { data: orderCount, label: "Orders", color: "#0f766e", showMark: true, yAxisId: "orders" },
            ]}
            grid={{ horizontal: true }}
            slotProps={{ legend: { direction: "row", position: { vertical: "top", horizontal: "right" } } }}
            sx={{
              ".MuiAreaElement-root": { fill: "rgba(37, 99, 235, 0.12)" },
              ".MuiLineElement-root": { strokeWidth: 3 },
              ".MuiChartsGrid-line": { stroke: "#e2e8f0", strokeDasharray: "4 4" },
            }}
          />
        ) : (
          <Box sx={{ height: 280, display: "grid", placeItems: "center", color: "#94a3b8" }}>
            <Typography variant="body2">No dated revenue or order data available yet</Typography>
          </Box>
        )}
      </Paper>

      <Paper elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
          Payment mix
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Share of payment records by status
        </Typography>
        {statusData.length ? (
          <PieChart
            height={280}
            series={[{ data: statusData, innerRadius: 62, outerRadius: 100, paddingAngle: 3, cornerRadius: 4 }]}
            slotProps={{ legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" } } }}
            sx={{ "& .MuiChartsLegend-label": { fontSize: 12 } }}
          />
        ) : (
          <Stack height={280} alignItems="center" justifyContent="center" color="#94a3b8">
            <Typography variant="body2">No payment data available yet</Typography>
          </Stack>
        )}
      </Paper>
    </div>
  );
};

export default RevenueReport;
