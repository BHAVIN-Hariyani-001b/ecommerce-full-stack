import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import Search from "../../../components/common/Search";

const ORDER_STATUSES = [
  { value: "All", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderSearch = ({ statusFilter, setStatusFilter, onSearch }) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-2 w-full gap-4 py-4 max-[600px]:flex max-[600px]:flex-col"
    >
      <div className="flex items-center border border-gray-200 rounded-xl h-12 px-3">
        <select
          name="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none outline-none w-full h-full cursor-pointer bg-transparent text-sm p-2"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <IoIosArrowDown className="shrink-0 text-gray-400" />
      </div>

      <Search onSearch={onSearch} />
    </form>
  );
};

export default OrderSearch;
