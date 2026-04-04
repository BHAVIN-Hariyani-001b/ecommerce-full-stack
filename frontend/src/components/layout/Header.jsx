import { FaRegCircleUser } from "react-icons/fa6";
import { GrCart } from "react-icons/gr";
import { MdOutlineSearch } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <>
      <HeaderBar />
      <Navbar />
    </>
  );
};

const HeaderBar = () => {
  return (
    <div className="border-b border-gray-200 sticky top-0 bg-white">
      <header>
        <div className="flex items-center justify-between py-1 px-30  text-[#586274] gap-3 max-[1000px]:px-10 max-[600px]:px-6 max-[600px]:pb-16 max-[600px]:gap-2 max-[600px]:relative">
          <div>
            <img
              src="http://localhost:5173/src/assets/images/logo1.png"
              alt="Logo"
              className="w-70 h-20 object-contain max-[600px]:w-40 max-[800px]:w-100 max-[1200px]:w-240"
            />
          </div>
          <div className="mr-10">
            <p className="flex gap-1 items-center cursor-pointer max-[600px]:hidden group text-[#474554] font-medium text-nowrap">
              Select Location
              <IoIosArrowDown className="group-hover:rotate-180 transition-transform duration-200 text-[15px]" />
            </p>
          </div>
          <div className="w-full max-w-svw flex items-center justify-center cursor-pointer pr-4 max-[600px]:absolute max-[600px]:left-0 max-[600px]:right-0 max-[600px]:mx-auto max-[600px]:top-21 max-[600px]:px-4">
            <a className="border border-gray-300 flex items-center bg-white text-[#454d5c] rounded-xl w-full h-12 py-2 px-4 gap-1">
              <MdOutlineSearch className="text-2xl text-[#454d5c]" />
              Search...
            </a>
          </div>
          <div className="flex items-center gap-3 justify-center max-[1000px]:gap-5 max-[500px]:gap-3">
            <div className="flex items-center flex-col justify-center gap-1 cursor-pointer">
              <FaRegCircleUser className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5" />
              <p>Login</p>
            </div>
            <div className="flex items-center flex-col justify-center gap-1 cursor-pointer relative">
              <GrCart className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5" />
              <p>Cart</p>
              <span className=" flex items-center justify-center -right-2 -top-2 absolute bg-[#8685ef] text-white w-6 h-6 rounded-full font-medium max-[500px]:w-5 max-[500px]:h-5">
                1
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
