import { memo } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrCart } from "react-icons/gr";
import { MdOutlineSearch } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "../common/Search";
import Logout from "../Popup/Logout";
import logo from "../../assets/images/logo/logo.jpeg";
import SearchAnimation from "../animation/SearchAnimation";

const HeaderBar = memo(function HeaderBar({
  onLoginClick,
  setSideBar,
  sideBar,
  onSearch,
}) {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth?.user);
  const isSearchPage = location.pathname === "/search";

  // console.log(useSelector((state) => state.auth));

  const count = useSelector((state) => state.cart.count);
  return (
    <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
      <header>
        <div className="flex items-center justify-between py-1 px-30  text-[#586274] gap-3 max-[1000px]:px-10 max-[600px]:px-6 max-[600px]:pb-16 max-[600px]:gap-2 max-[600px]:relative">
          <div className="max-[600px]:hidden">
            <NavLink to={"/"}>
              <img
                src={logo}
                alt="Logo"
                className="w-70 h-20 object-contain max-[600px]:w-40 max-[800px]:w-100 max-[1200px]:w-240"
              />
            </NavLink>
          </div>
          <div className="mr-10 max-[700px]:hidden">
            <p className="flex gap-1 items-center justify-center cursor-pointer max-[600px]:hidden group text-[#474554] font-medium text-nowrap">
              <FaLocationDot />
              <span>Select Location</span>
              <IoIosArrowDown className="group-hover:rotate-180 transition-transform duration-200 text-[15px]" />
            </p>
          </div>
          <div className="w-full max-w-svw flex items-center justify-center cursor-pointer pr-4 max-[600px]:absolute max-[600px]:left-0 max-[600px]:right-0 max-[600px]:mx-auto max-[600px]:top-3 max-[600px]:px-2">
            {isSearchPage ? (
              <Search onSearch={onSearch} />
            ) : (
              <NavLink
                to={"/search"}
                className="border border-gray-300 flex items-center cursor-text bg-white text-[#454d5c] rounded-lg w-full h-12 py-2 px-4 gap-1 overflow-hidden"
              >
                <MdOutlineSearch className="text-2xl text-[#454d5c]" />
                <SearchAnimation />
              </NavLink>
            )}
          </div>
          <div className="flex items-center gap-3 justify-center max-[1000px]:gap-5 max-[500px]:gap-3 max-[600px]:hidden">
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={onLoginClick}
                className="flex items-center flex-col justify-center cursor-pointer"
              >
                <FaRegCircleUser className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5" />
                <p>Login</p>
              </button>
            ) : (
              <Logout />
            )}
            <div className="flex items-center flex-col justify-center cursor-pointer relative">
              <button
                className="cursor-pointer"
                onClick={() => setSideBar(!sideBar)}
              >
                <GrCart className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5" />
                <p>Cart</p>
                {count !== 0 && (
                  <div className="flex items-center justify-center -right-3 -top-3 text-[12px] absolute bg-[#8685ef] text-white min-w-6 min-h-6 rounded-full">
                    <span className="h-full w-full px-1">
                      {count < 10 ? count : "10+"}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
});

export default HeaderBar;
