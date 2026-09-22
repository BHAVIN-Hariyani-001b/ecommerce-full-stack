import { useState } from "react";
import { GrDeliver } from "react-icons/gr";
import {
  IoIosArrowForward,
  IoIosCloseCircle,
  IoIosArrowBack,
} from "react-icons/io";
import { IoFlameOutline } from "react-icons/io5";
import { LuPackageCheck } from "react-icons/lu";
import { MdPendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import OrderConfirmation from "../checkout/OrderConfirmation";
import { TbFileDownloadFilled } from "react-icons/tb";
import { getGenerateInvoice } from "../../middleware/order";
import toast from "react-hot-toast";

const STATUS_META = {
  shipped: {
    label: "SHIPPED",
    icon: GrDeliver,
    text: "text-blue-400",
    border: "border-blue-400",
  },
  delivered: {
    label: "DELIVERED",
    icon: LuPackageCheck,
    text: "text-green-500",
    border: "border-green-500",
  },
  cancelled: {
    label: "CANCELLED",
    icon: IoIosCloseCircle,
    text: "text-red-400",
    border: "border-red-400",
  },
  confirmed: {
    label: "CONFIRMED",
    icon: LuPackageCheck,
    text: "text-yellow-400",
    border: "border-yellow-400",
  },
  pending: {
    label: "PENDING",
    icon: MdPendingActions,
    text: "text-gray-400",
    border: "border-gray-400",
  },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "pending", label: "Pending" },
  { key: "cancelled", label: "Cancelled" },
  { key: "confirmed", label: "Confirmed" },
];

function orderTotal(order) {
  return Number(order?.total_amount || 0);
}

function formatOrderDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function OrderCard({ order, onDetails }) {
  const meta = STATUS_META[order.status?.toLowerCase()] || STATUS_META.pending;
  const Icon = meta.icon;
  const total = orderTotal(order);
  const items = Array.isArray(order.order_item) ? order.order_item : [];

  return (
    <div className="border rounded-lg border-gray-300">
      <div className="grid grid-cols-6">
        <div className="border-r border-dashed border-gray-300 p-4 bg-gray-200/40 flex   justify-center items-center">
          <div
            className={`flex flex-col items-center justify-center -rotate-4 ${meta.text}`}
          >
            <div
              className={`w-12 h-12 rounded-full border border-dashed ${meta.border} flex items-center justify-center`}
            >
              <Icon />
            </div>
            <span className="text-[10px] font-mono">{meta.label}</span>
          </div>
        </div>

        <div className="col-span-5 py-2 px-4 space-y-5">
          <div>
            <div className="flex justify-between items-center">
              <div className="font-mono flex gap-2 items-center">
                <span className="text-[14px] text-gray-500">№</span>
                <span className="text-[12px]">{order.OrderId || order.id}</span>
              </div>
              <div className="text-[12px] font-mono text-gray-500">
                {formatOrderDate(order.create_at)}
              </div>
            </div>

            <div className="space-y-3 mt-3">
              <div className="space-y-3 mt-3">
                {items.map((item) => {
                  const imageName = item?.product?.image?.image_name;

                  return (
                    <div
                      key={item.id}
                      className="text-[14px] flex gap-3 items-center"
                    >
                      {imageName ? (
                        <img
                          src={`/image/product_img/${imageName}`}
                          alt={item?.product?.name || "Product"}
                          className="w-12 h-12 object-contain rounded bg-gray-50 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 shrink-0 flex items-center justify-center text-[10px] text-gray-400">
                          No img
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h1 className="text-[16px] font-medium  truncate">
                          {item?.product?.name || "Product"}
                        </h1>

                        <p className="text-[12px] line-clamp-2 font-normal text-gray-500">
                          Qty: {item?.qty || 0}
                        </p>
                      </div>

                      <div className="font-mono text-[13px] text-end shrink-0">
                        ₹{Number(item?.line_total || 0).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2 border-gray-300 border-t border-dashed flex justify-between items-center">
            <div className="space-x-3">
              <span className="text-[12px] text-gray-500">Total</span>
              <span className="font-mono">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-center items-center gap-3 text-[14px]">
              <button
                type="button"
                onClick={() => onDetails(order)}
                className="flex justify-center items-center gap-1 text-[14px] text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <span>Details</span>
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ statusLabel }) {
  return (
    <div className="border rounded-lg border-dashed border-gray-300 py-14 px-6 flex flex-col items-center text-center bg-gray-50">
      <div className="w-12 h-12 rounded-full border border-dashed border-gray-300 flex items-center justify-center mb-3 text-gray-400">
        <IoFlameOutline />
      </div>
      <p className="font-serif text-[16px] font-medium text-gray-700 mb-1">
        Nothing {statusLabel.toLowerCase()} right now
      </p>
      <p className="text-[13px] text-gray-500 max-w-xs">
        When a bag hits this stage, its ticket will show up here.
      </p>
    </div>
  );
}

const UserOrderHistory = () => {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userOrders = useSelector((state) => state.orders?.order) ?? [];
  const filtered =
    filter === "all"
      ? userOrders
      : userOrders.filter((o) => o.status?.toLowerCase() === filter);

  const { invoice_link, error, loading } = useSelector((state) => state.orders);

  const handleDownloadInvoice = async (orderId, invoiceNumber) => {
    try {
      if (selectedOrder.payment_status !== "success") {
        toast.error("Please complete the payment first.");
        return;
      }

      const response = await getGenerateInvoice(orderId);

      const blob = new Blob([response], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoiceNumber}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Invoice download failed:", error);
    }
  };

  if (selectedOrder) {
    return (
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setSelectedOrder(null)}
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:-translate-x-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-blue-50">
              <IoIosArrowBack className="transition-transform group-hover:-translate-x-0.5" />
            </span>
            <span>Back to order history</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleDownloadInvoice(
                selectedOrder.id,
                invoice_link.invoice_number,
              )
            }
            className="bg-gray-100 px-3 py-2 rounded-full group"
          >
            <span className="flex justify-center items-center space-x-2">
              <TbFileDownloadFilled className="group-hover:text-blue-600" />
              <span>Download</span>
            </span>
          </button>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            Order details
          </p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-gray-900">
            {selectedOrder.OrderId || selectedOrder.id}
          </h1>
        </div>
        <OrderConfirmation orderResult={selectedOrder} showContinue={false} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-[26px] font-semibold text-gray-900">
          Order History
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[12px] px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((order) => (
            <OrderCard
              key={order.id || order.OrderId}
              order={order}
              onDetails={setSelectedOrder}
            />
          ))
        ) : (
          <EmptyState
            statusLabel={FILTERS.find((f) => f.key === filter)?.label || ""}
          />
        )}
      </div>
    </div>
  );
};

export default UserOrderHistory;
