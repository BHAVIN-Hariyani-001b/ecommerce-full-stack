import { FaRegCircleUser } from "react-icons/fa6";
import { GrCart } from "react-icons/gr";
import { MdOutlineSearch } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Search from "../common/Search";
import { logout } from "../../features/auth/authSlice";
import Modal from "../common/Modal";

const HeaderBar = ({ onLoginClick }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token || user);
  const displayName = user?.username || user?.name || user?.email || "Profile";
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
      <header>
        <div className="flex items-center justify-between py-1 px-30  text-[#586274] gap-3 max-[1000px]:px-10 max-[600px]:px-6 max-[600px]:pb-16 max-[600px]:gap-2 max-[600px]:relative">
          <div>
            <NavLink to={"/"}>
              <img
                src="http://localhost:5173/src/assets/images/logo1.png"
                alt="Logo"
                className="w-70 h-20 object-contain max-[600px]:w-40 max-[800px]:w-100 max-[1200px]:w-240"
              />
            </NavLink>
          </div>
          <div className="mr-10">
            <p className="flex gap-1 items-center justify-center cursor-pointer max-[600px]:hidden group text-[#474554] font-medium text-nowrap">
              <FaLocationDot />
              <span>Select Location</span>
              <IoIosArrowDown className="group-hover:rotate-180 transition-transform duration-200 text-[15px]" />
            </p>
          </div>
          <div className="w-full max-w-svw flex items-center justify-center cursor-pointer pr-4 max-[600px]:absolute max-[600px]:left-0 max-[600px]:right-0 max-[600px]:mx-auto max-[600px]:top-21 max-[600px]:px-4">
            {location.pathname === "/search" ? (
              <Search />
            ) : (
              <NavLink
                to={"/search"}
                className="border border-gray-300 flex items-center cursor-text bg-white text-[#454d5c] rounded-xl w-full h-12 py-2 px-4 gap-1"
              >
                <MdOutlineSearch className="text-2xl text-[#454d5c]" />
                Search...
              </NavLink>
            )}
          </div>
          <div className="flex items-center gap-3 justify-center max-[1000px]:gap-5 max-[500px]:gap-3">
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={onLoginClick}
                className="flex items-center flex-col justify-center gap-1 cursor-pointer"
              >
                <FaRegCircleUser className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5" />
                <p>Login</p>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setLogoutOpen(true)}
                  className="flex items-center flex-col justify-center gap-1 cursor-pointer"
                  aria-label="Open profile menu"
                >
                  <FaRegCircleUser className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5" />
                  <p className="max-w-24 truncate" title={displayName}>
                    {displayName}
                  </p>
                </button>

                <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Account">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8685ef]/15 flex items-center justify-center">
                        <FaRegCircleUser className="text-[#8685ef] text-xl" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#586274]">Signed in as</p>
                        <p className="font-semibold text-[#2b2f3a] truncate" title={displayName}>
                          {displayName}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setLogoutOpen(false)}
                        className="border cursor-pointer border-gray-200 text-[#454d5c] rounded-xl px-4 py-2 text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(logout());
                          setLogoutOpen(false);
                        }}
                        className="cursor-pointer rounded-xl bg-[#8685ef] text-white px-4 py-2 text-sm font-medium hover:opacity-95 active:opacity-90 transition-opacity"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </Modal>
              </>
            )}
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

export default HeaderBar;
