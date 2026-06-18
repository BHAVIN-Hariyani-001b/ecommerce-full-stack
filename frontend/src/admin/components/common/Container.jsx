import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const Container = ({ children, setActivePage }) => {
  return (
    <div className="w-full h-full">
      <div className="flex items-center px-4 pt-5 pb-0">
        <button
          type="button"
          onClick={() => setActivePage("dashboard")}
          className="text-lg cursor-pointer flex items-center group justify-center gap-1 hover:bg-gray-100 transition-all ease-in-out delay-100 p-2 rounded-lg"
        >
          <IoIosArrowBack className="group-hover:-translate-x-1 transition-all delay-75 ease-in-out" />
          <div>Back</div>
        </button>
      </div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Container;
