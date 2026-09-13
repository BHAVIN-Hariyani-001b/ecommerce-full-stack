import { IoIosArrowDown } from "react-icons/io";
import Search from "../../../components/common/Search";

const PAYMENT_STATUSES = [
  { value: "All", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const PAYMENT_METHODS = [
  { value: "All", label: "All Methods" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "cod", label: "Cash on delivery" },
];

const PaymentSerch = ({ statusFilter, setStatusFilter, methodFilter, setMethodFilter, onSearch }) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid w-full grid-cols-1 gap-3 py-4 md:grid-cols-3 max-[600px]:flex max-[600px]:flex-col"
    >
      <div className="flex items-center border border-gray-200 rounded-xl h-12 px-3">
        <select
          name="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none outline-none w-full h-full cursor-pointer bg-transparent text-sm p-2"
        >
          {PAYMENT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <IoIosArrowDown className="shrink-0 text-gray-400" />
      </div>

      <div className="flex items-center border border-gray-200 rounded-xl h-12 px-3">
        <select
          name="Method"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="appearance-none outline-none w-full h-full cursor-pointer bg-transparent text-sm p-2"
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>{method.label}</option>
          ))}
        </select>
        <IoIosArrowDown className="shrink-0 text-gray-400" />
      </div>

      <Search onSearch={onSearch} />
    </form>
  );
};

export default PaymentSerch;

