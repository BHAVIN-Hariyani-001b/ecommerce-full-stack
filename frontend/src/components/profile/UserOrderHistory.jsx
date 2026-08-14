import React, { useState } from "react";
import { GrDeliver } from "react-icons/gr";
import { VscDebugRestart } from "react-icons/vsc";
import { IoIosArrowForward } from "react-icons/io";
import { LuPackageCheck } from "react-icons/lu";

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
};

const ORDERS = [
  {
    id: "0587",
    date: "Aug 5, 2026",
    status: "shipped",
    items: [
      {
        name: "Oversized Cotton T-Shirt",
        category: "Fashion",
        color: "Black",
        size: "L",
        qty: 1,
        price: 24,
      },
    ],
  },
  {
    id: "0562",
    date: "Jul 22, 2026",
    status: "delivered",
    items: [
      {
        name: "Slim Fit Denim Jeans",
        category: "Fashion",
        color: "Blue",
        size: "32",
        qty: 1,
        price: 45,
      },
      {
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        color: "Black",
        qty: 1,
        price: 59,
      },
    ],
  },
  {
    id: "0541",
    date: "Jul 8, 2026",
    status: "delivered",
    items: [
      {
        name: "Classic Sneakers",
        category: "Fashion",
        color: "White",
        size: "9",
        qty: 2,
        price: 39,
      },
    ],
  },
  {
    id: "0519",
    date: "Jun 24, 2026",
    status: "delivered",
    items: [
      {
        name: "Smart LED Desk Lamp",
        category: "Electronics",
        color: "White",
        qty: 1,
        price: 32,
      },
    ],
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function orderTotal(order) {
  return order.items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

function OrderCard({ order }) {
  const meta = STATUS_META[order.status];
  const Icon = meta.icon;
  const total = orderTotal(order);

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
                <span className="text-[12px]">{order.id}</span>
              </div>
              <div className="text-[12px] font-mono text-gray-500">
                {order.date}
              </div>
            </div>

            <div className="space-y-3 mt-3">
              <div className="space-y-3 mt-3">
                {order.items.map((it, idx) => (
                  <div key={idx} className="text-[14px] grid grid-cols-6">
                    <div className="col-span-5">
                      <h1 className="text-[16px] font-medium font-serif">
                        {it.name}
                      </h1>

                      <p className="text-[12px] line-clamp-2 font-normal text-gray-500">
                        {it.category}
                        {it.color ? ` · ${it.color}` : ""}
                        {it.size ? ` · Size ${it.size}` : ""}
                        {it.qty > 1 ? ` · Qty ${it.qty}` : ""}
                      </p>
                    </div>

                    <div className="font-mono text-[13px] text-end">
                      ${(it.price * it.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-gray-300 border-t border-dashed flex justify-between items-center">
            <div className="space-x-3">
              <span className="text-[12px] text-gray-500">Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-center items-center gap-3 text-[14px]">
              <button className="bg-blue-600 hover:bg-blue-700 text-white flex justify-center cursor-pointer items-center gap-2 py-1 px-3 rounded-full outline-none border-2 border-transparent focus:border-blue-300 transition-colors">
                <VscDebugRestart />
                <span>Reorder</span>
              </button>
              <button className="flex justify-center items-center gap-1 text-[14px] text-gray-600 hover:text-gray-900 cursor-pointer">
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
  const filtered =
    filter === "all" ? ORDERS : ORDERS.filter((o) => o.status === filter);

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
          filtered.map((order) => <OrderCard key={order.id} order={order} />)
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
