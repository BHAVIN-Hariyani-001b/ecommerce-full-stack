import { NavLink } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";

const RecentOrder = () => {
  const userOrderDetails = [
    {
      Name: "Hemal Gosia",
      OrderId: "#ORD-9078",
      OrderMrp: 120.7,
      OrderStatus: "PENDING",
    },
    {
      Name: "Anand Hariyani",
      OrderId: "#ORD-9078",
      OrderMrp: 120.7,
      OrderStatus: "SUCCESS",
    },
    {
      Name: "Sagil kureshi",
      OrderId: "#ORD-9078",
      OrderMrp: 120.7,
      OrderStatus: "PENDING",
    },
  ];
  return (
    <div className="px-4 py-1 w-full">
      <div className="flex justify-between">
        <h1 className="text font-medium pl-1 pb-4">Recent Orders</h1>
        <NavLink
          to="/"
          className="text-blue-800 font-semibold text-[14px] cursor-pointer"
        >
          View All
        </NavLink>
      </div>
      <div className="overflow-auto h-35 max-h-60 max-[1400px]:h-full max-[600px]:h-full space-y-3 scrollbar-none scrollbar-none">
        {userOrderDetails.map((item, index) => (
          <UserOederList
            key={index}
            OrdName={item.Name}
            OrdId={item.OrderId}
            OrdMrp={item.OrderMrp}
            OrdStstus={item.OrderStatus}
          />
        ))}
      </div>
    </div>
  );
};

const UserOederList = ({ OrdName, OrdId, OrdMrp, OrdStstus }) => {
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
        <p>$ {OrdMrp}</p>
        <span className="bg-orange-100 text-orange-800 font-semibold text-[10px] text-center rounded-2xl">
          {OrdStstus}
        </span>
      </div>
    </div>
  );
};

export default RecentOrder;
