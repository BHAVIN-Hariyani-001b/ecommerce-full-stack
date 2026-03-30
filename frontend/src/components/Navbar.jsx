// import { Link } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrCart } from "react-icons/gr";
import { MdOutlineSearch } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  return (
    <>
      <>
        <header>
          <nav className="flex items-center justify-between py-3 px-25 text-[#586274] gap-3 border-b-2 border-gray-200 max-[1000px]:px-10 max-[600px]:px-6 max-[600px]:pb-16 max-[600px]:gap-2 max-[600px]:relative">
            <div>
              <img
                src="http://localhost:5173/src/assets/images/logo1.png"
                alt="Logo"
                className="w-70 h-20 object-contain max-[600px]:w-40 max-[800px]:w-100"
              />
            </div>
            <div>
              <p className="flex gap-1 items-center cursor-pointer max-[600px]:hidden group text-[#474554] font-medium text-nowrap">
                Select Location
                <IoIosArrowDown className="group-hover:rotate-180 transition-transform duration-200 text-[15px]" />
              </p>
            </div>
            <div className="w-full max-w-svh flex items-center justify-center cursor-pointer pr-4 max-[600px]:absolute max-[600px]:left-0 max-[600px]:right-0 max-[600px]:mx-auto max-[600px]:top-21 max-[600px]:px-4">
              <a className="border border-gray-300 flex items-center text-[#454d5c] rounded-md w-full h-13 py-2 px-4 gap-1">
                <MdOutlineSearch className="text-2xl" />
                Search...
              </a>
            </div>
            <div className="flex items-center gap-10 justify-center max-[1000px]:gap-5 max-[500px]:gap-3">
              <div className="flex items-center flex-col justify-center gap-1 cursor-pointer">
                <FaRegCircleUser className="w-10 h-7 max-[600px]:w-8 max-[600px]:h-5" />
                <p>Login</p>
              </div>
              <div className="flex items-center flex-col justify-center gap-1 cursor-pointer">
                <GrCart className="w-10 h-7 max-[600px]:w-8 max-[600px]:h-5" />
                <p>Cart</p>
              </div>
            </div>
          </nav>
        </header>
      </>
    </>
  );
};

export default Navbar;
