import { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUsersRound } from "react-icons/lu";
import { RiShoppingBagLine } from "react-icons/ri";
import { TbCash } from "react-icons/tb";
import MathOverviewCard from "./MathOverviewCard";
import { getOrderAPI } from "../../features/orders/orderThunk";
import { fetchUserAPI } from "../features/user/userThunk";
import { paymentDataFetchAPI } from "../features/payment/paymentThunk";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const Overview = memo(function Overview() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.order) ?? [];
  const users = useSelector((state) => state.user?.users) ?? [];
  const payments = useSelector((state) => state.payment?.paymentData) ?? [];

  useEffect(() => {
    dispatch(getOrderAPI());
    dispatch(fetchUserAPI());
    dispatch(paymentDataFetchAPI());
  }, [dispatch]);

  const items = useMemo(() => {
    const netRevenue = (Array.isArray(payments) ? payments : []).reduce(
      (sum, item) => {
        if (item.status === "failed") return sum;
        return (
          sum + Number(item.amount_paid || 0) - Number(item.amount_refunded || 0)
        );
      },
      0,
    );

    return [
      {
        titel: "Total Sales",
        description: formatCurrency(netRevenue),
        icon: <TbCash />,
      },
      {
        titel: "Orders",
        description: String(orders.length),
        icon: <RiShoppingBagLine />,
      },
      {
        titel: "Customers",
        description: String(
          (Array.isArray(users) ? users : []).filter(
            (user) => user.role !== "admin",
          ).length,
        ),
        icon: <LuUsersRound />,
      },
    ];
  }, [orders, users, payments]);

  return (
    <div className="px-4 py-1 w-full">
      <h1 className="text font-medium pl-1">Overview</h1>
      <div className="flex gap-4 pt-3 pb-3 overflow-auto">
        {items.map((item) => (
          <MathOverviewCard
            key={item.titel}
            title={item.titel}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
});

export default Overview;
