import { memo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getOrderSummaryAPI } from "../../../features/orders/orderThunk";

const UserOrderList = memo(function UserOrderList({
  OrdName,
  OrdId,
  OrdMrp,
  OrdStstus,
}) {
  const statusStyles = {
    pending: "bg-orange-100 text-orange-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="px-4 py-3 rounded-lg border border-gray-300 flex justify-between">
      <div className="flex justify-center items-center gap-7">
        <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
          <FaRegUser />
        </div>
        <div className="text-[14px]">
          <p className="font-semibold">{OrdName}</p>
          <span>{OrdId}</span>
        </div>
      </div>
      <div className="flex flex-col justify-end gap-1">
        <p>&#8377; {OrdMrp}</p>
        <span
          className={`${statusStyles[OrdStstus] || "bg-gray-100 text-gray-800"} font-semibold text-[10px] text-center rounded-2xl`}
        >
          {OrdStstus}
        </span>
      </div>
    </div>
  );
});

const RecentOrder = memo(function RecentOrder({ setActivePage }) {
  const dispatch = useDispatch();
  const orderSummary = useSelector((state) => state.orders?.orderSummary);

  useEffect(() => {
    dispatch(getOrderSummaryAPI());
  }, [dispatch]);

  return (
    <div className="px-4 py-1 w-full">
      <div className="flex justify-between">
        <h1 className="text font-medium pl-1 pb-4">Recent Orders</h1>
        <button
          className="text-blue-800 font-semibold text-[14px] cursor-pointer"
          onClick={() => setActivePage("orders")}
        >
          View All
        </button>
      </div>
      <div className="overflow-auto h-35 max-h-60 max-[1300px]:h-full max-[600px]:h-full space-y-3 scrollbar-none scrollbar-none">
        {Array.isArray(orderSummary) && orderSummary.length > 0 ? (
          orderSummary.map((item) => (
            <UserOrderList
              key={`${item.Name}-${item.OrderId}`}
              OrdName={item.Name}
              OrdId={item.OrderId}
              OrdMrp={item.OrderMrp}
              OrdStstus={item.OrderStatus}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400 py-6 text-center">No recent orders</p>
        )}
      </div>
    </div>
  );
});

export default RecentOrder;
