import { LuUsersRound } from "react-icons/lu";
import { RiShoppingBagLine } from "react-icons/ri";
import { TbCash } from "react-icons/tb";
import MathOverviewCard from "./MathOverviewCard";

const Overview = () => {
  const OverviewAc = [
    {
      titel: "Total Sales",
      description: "$12,500",
      icon: <TbCash />,
    },
    {
      titel: "Orders",
      description: "142",
      icon: <RiShoppingBagLine />,
    },
    {
      titel: "Customers",
      description: "89",
      icon: <LuUsersRound />,
    },
  ];

  return (
    <div className="px-4 py-1 w-full">
      <h1 className="text font-medium pl-1">Overview</h1>
      <div className="flex gap-4 pt-3 pb-3 overflow-auto">
        {OverviewAc.map((item, index) => (
          <MathOverviewCard
            key={index}
            title={item.titel}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Overview;
