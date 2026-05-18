import { IoMdAddCircleOutline } from "react-icons/io";
import { MdListAlt } from "react-icons/md";
import { BiBox } from "react-icons/bi";
import { BiBarChartSquare } from "react-icons/bi";

const QuickActions = () => {
  const QuickActionsAc = [
    {
      icon: <IoMdAddCircleOutline />,
      title: "Add Product",
    },
    {
      icon: <MdListAlt />,
      title: "View Orders",
    },
    {
      icon: <BiBox />,
      title: "Inventory",
    },
    {
      icon: <BiBarChartSquare />,
      title: "Sales Report",
    },
  ];
  return (
    <div className="px-4 py-1 w-full">
      <h1 className="text font-medium pl-1">Quick Actions</h1>
      <div className="pt-3 pb-3 grid grid-cols-2 gap-2">
        {QuickActionsAc.map((item, index) => (
          <QuickActionsBtn
            key={index}
            icon={item.icon}
            className={"text-2xl"}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
};

const QuickActionsBtn = ({ icon, title, className }) => {
  return (
    <button className="border focus:bg-blue-700 first:bg-blue-700 first:hover:text-black first:focus:hover:text-white first:text-white focus:text-white focus:hover:scale-98 transition-all delay-75 border-gray-300 cursor-pointer rounded-lg w-full h-25 flex flex-col justify-center items-center gap-3 hover:bg-blue-100">
      <div className={`${className} font-semibold`}>{icon}</div>
      <span className="text-[14px]">{title}</span>
    </button>
  );
};

export default QuickActions;
