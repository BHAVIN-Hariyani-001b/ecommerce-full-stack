import React, { memo } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";


const SideBar = ({ sideBarOpen, setSideBar, setActivePage }) => {
  const SideBarMenuItem = [
    "Inventory",
    "Sales Report",
    "View Orders",
    "Category",
    "HeroSection",
    "Header",
    "Footer",
  ];

  return (
    <>
      <div
        onClick={() => setSideBar(false)}
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${sideBarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <aside
        className={`h-full w-64 fixed left-0 top-0 z-30 bg-gray-100 border border-gray-300 rounded-r-xl
          transition-all duration-300 ease-in-out
          ${sideBarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <div className="text-xl w-full flex items-center p-2">
          <div className="flex justify-end items-center w-full px-3">
            <button
              onClick={() => setSideBar(false)}
              className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300 cursor-pointer"
            >
              <IoClose size={30} className="hover:rotate-90 transition-all duration-300" />
            </button>
          </div>
        </div>

        <div className="flex flex-col px-3 gap-1">
          {SideBarMenuItem.map((item, index) => (
            <button
              key={item}
              onClick={() => {
                setActivePage(item);
                setSideBar(false);
              }}
              style={{
                transitionDelay: sideBarOpen ? `${index * 40}ms` : "0ms",
              }}
              className={`py-3 px-4 rounded-md hover:bg-blue-100 group hover:scale-105 
                transition-all duration-300 cursor-pointer flex items-center justify-between 
                text-gray-700 hover:text-gray-900 
                ${sideBarOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
            >
              <span className="font-medium">{item}</span>
              <FaArrowUpRightFromSquare className="hidden group-hover:block text-blue-500" />
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default memo(SideBar);