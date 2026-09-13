import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const COLORS = {
  orders: "#2563eb",
  payments: "#0f766e",
};

const ReportChart = ({ orderStatus = {}, paymentStatus = {} }) => {
  const labels = Array.from(
    new Set([...Object.keys(orderStatus), ...Object.keys(paymentStatus)]),
  );
  const orders = labels.map((label) => Number(orderStatus[label] || 0));
  const payments = labels.map((label) => Number(paymentStatus[label] || 0));
  const hasData = labels.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ px: 2.5, pt: 2.5 }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
            Order and payment report
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Compare transaction activity by status
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ color: "#64748b" }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: COLORS.orders }} />
            <Typography variant="caption">Orders</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: COLORS.payments }} />
            <Typography variant="caption">Payments</Typography>
          </Stack>
        </Stack>
      </Stack>

      {hasData ? (
        <BarChart
          height={320}
          margin={{ top: 24, right: 24, bottom: 48, left: 46 }}
          xAxis={[{ scaleType: "band", data: labels, tickLabelStyle: { fontSize: 12 } }]}
          yAxis={[{ min: 0, tickLabelStyle: { fontSize: 12 } }]}
          series={[
            { data: orders, label: "Orders", color: COLORS.orders },
            { data: payments, label: "Payments", color: COLORS.payments },
          ]}
          slotProps={{ legend: { hidden: true } }}
          grid={{ horizontal: true }}
          sx={{
            ".MuiChartsGrid-line": { stroke: "#e2e8f0", strokeDasharray: "4 4" },
            ".MuiBarElement-root": { rx: 4 },
          }}
        />
      ) : (
        <Box sx={{ height: 320, display: "grid", placeItems: "center", color: "#94a3b8" }}>
          <Typography variant="body2">No report data available yet</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ReportChart;
