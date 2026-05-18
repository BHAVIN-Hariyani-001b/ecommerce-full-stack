import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { MdShoppingCart } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";

const BottomMenu = () => {
  const BottomMenu = [
    {
      icon: <MdDashboard size={25} color="#5c647a" />,
      itemName: "Dashboard",
    },
    {
      icon: <FaBoxArchive size={21} color="#5c647a" />,
      itemName: "Products",
    },
    {
      icon: <MdShoppingCart size={25} color="#5c647a" />,
      itemName: "Orders",
    },
    {
      icon: <AiFillSetting size={25} color="#5c647a" />,
      itemName: "Settings",
    },
  ];

  return (
    <div className="flex gap-3 justify-evenly items-center h-full">
      {BottomMenu.map((item,index) => (
        <div key={index} className="hover:bg-[#dae2fd] transition-all duration-300 hover:text-gray-500 cursor-pointer ease-in-out delay-75 h-15 w-25 rounded-4xl flex flex-col justify-center items-center">
          {item.icon}
          <p className="text-[13px] font-medium text-[#5c647a]">{item.itemName}</p>
        </div>
      ))}
    </div>
  );
};

export default BottomMenu;
