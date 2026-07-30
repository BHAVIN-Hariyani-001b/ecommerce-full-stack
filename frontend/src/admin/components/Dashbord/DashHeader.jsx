import { memo } from "react";
import { CgMenuLeft } from "react-icons/cg";
import Logout from "../../../components/Popup/Logout";
import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const DashHeader = memo(function DashHeader({ setSideBar,sideBar }) {
  return (
    <nav className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center max-[600px]:space-x-3 space-x-10">
          <button onClick={()=>setSideBar(!sideBar)} className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 ease-in-out delay-100 cursor-pointer">
           {!sideBar ?  <CgMenuLeft size={"25px"} /> : <IoClose size={"25px"} className="hover:rotate-90 transition-all delay-150" /> }
          </button>
          <h1 className="text-xl font-bold text-[#8685ef] cursor-pointer">
            <NavLink
              to="/admin"
              className="hover:text-gray-500 transition-colors duration-300"
            >
              Dashboard
            </NavLink>
          </h1>
        </div>
        <div className="mr-10 max-[600px]:mr-0">
          
          <Logout />
        </div>
      </div>
    </nav>
  );
});

export default DashHeader;
