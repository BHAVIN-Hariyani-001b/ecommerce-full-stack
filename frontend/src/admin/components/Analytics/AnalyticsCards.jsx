import { LuUsersRound } from "react-icons/lu";
import { RiShoppingBagLine } from "react-icons/ri";
import { TbCash } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiCreditCard } from "react-icons/bi";
import MathOverviewCard from "../MathOverviewCard";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const AnalyticsCards = ({ stats }) => {
  const items = [
    {
      titel: "Net Revenue",
      description: formatCurrency(stats.netRevenue),
      icon: <TbCash />,
    },
    {
      titel: "Orders",
      description: String(stats.orderCount ?? 0),
      icon: <RiShoppingBagLine />,
    },
    {
      titel: "Customers",
      description: String(stats.customerCount ?? 0),
      icon: <LuUsersRound />,
    },
    {
      titel: "Products",
      description: String(stats.productCount ?? 0),
      icon: <AiOutlineProduct />,
    },
    {
      titel: "Low / Out of stock",
      description: `${stats.lowStock ?? 0} / ${stats.outOfStock ?? 0}`,
      icon: <MdOutlineInventory2 />,
    },
    {
      titel: "Successful payments",
      description: String(stats.successPayments ?? 0),
      icon: <BiCreditCard />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item) => (
        <MathOverviewCard
          key={item.titel}
          title={item.titel}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default AnalyticsCards;
