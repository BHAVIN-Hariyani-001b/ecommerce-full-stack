import React from "react";
import { CgMenuLeft } from "react-icons/cg";
import Logout from "../../components/Popup/Logout";

const DashHeader = () => {
  return (
    <>
      <nav className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center max-[600px]:space-x-3 space-x-10">
            <div className="p-2 rounded-full hover:bg-gray-100 ease-in-out delay-100 cursor-pointer">
              <CgMenuLeft size={"25px"} />
            </div>
            <h1 className="text-xl font-bold text-[#8685ef] cursor-pointer">
              Dashboard
            </h1>
          </div>
          <div className="mr-10 max-[600px]:mr-0">
            <Logout />
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashHeader;
