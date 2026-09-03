import { memo, useCallback, useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrCart } from "react-icons/gr";
import { MdOutlineSearch } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "../common/Search";
import Logout from "../Popup/Logout";
import logo from "../../assets/images/logo/logo.jpeg";
import SearchAnimation from "../animation/SearchAnimation";

import { MdOutlineAddLocationAlt } from "react-icons/md";
import Modal from "../common/Modal";
import AddressDetails from "../profile/AddressDetails";
import { setIsUpdateAddress } from "../../features/userAddress/userAddressSlice";

const HeaderBar = memo(function HeaderBar({
  onLoginClick,
  setSideBar,
  sideBar,
  onSearch,
}) {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth?.user);
  const UserAddress = useSelector((state) => state.address?.Address);
  const isSearchPage = location.pathname === "/search";

  const [addressDetail, setAddressDetail] = useState(false);
  // const [openMouseHover, setOpenMouseHover] = useState(false);
  const dispatch = useDispatch();

  const handeleOpenAddressDetails = useCallback(
    () => setAddressDetail(true),
    [],
  );

  const handeleCloseAddressDetails = useCallback(
    () => {
      dispatch(setIsUpdateAddress(false));
      setAddressDetail(false);
    },
    [dispatch],
    [],
  );

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

          <div className="mr-10 max-[700px]:hidden relative group">
            {UserAddress.length === 0 ? (
              <p className="flex gap-1 items-center justify-center cursor-pointer max-[600px]:hidden group text-[#474554] font-medium text-nowrap">
                <FaLocationDot />
                <span>Select Location</span>
                <IoIosArrowDown className="group-hover:rotate-180 transition-transform duration-200 text-[15px]" />
              </p>
            ) : (
              <p className="flex gap-1 items-center justify-center cursor-pointer max-[600px]:hidden group text-[#474554] font-medium text-nowrap">
                <FaLocationDot />
                <span>{UserAddress[0]?.location_type.charAt(0).toUpperCase() + UserAddress[0]?.location_type.slice(1)} - </span>
                <span className="max-w-12 truncate">{`${UserAddress[0]?.city}, ${UserAddress[0]?.state}, ${UserAddress[0]?.street_area}`}</span>
                <IoIosArrowDown className="group-hover:rotate-180 transition-transform duration-200 text-[15px]" />
              </p>
            )}

            <div className="absolute w-37 opacity-0 p-2 rounded top-7 z-30 bg-white/99 shadow-md invisible duration-500 group-hover:opacity-100 group-hover:visible cursor-pointer transition-all">
              <div
                className="flex items-center justify-center gap-1"
                onClick={handeleOpenAddressDetails}
              >
                <MdOutlineAddLocationAlt />
                <span>Add Location</span>
              </div>
            </div>
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

        <Modal
          open={addressDetail}
          onClose={handeleCloseAddressDetails}
          title="Address"
          width={"max-[900px]:h-160 overflow-y-auto max-h-190 scrollbar-none"}
        >
          <AddressDetails
            handeleCloseAddressDetails={handeleCloseAddressDetails}
          />
        </Modal>
      </header>
    </div>
  );
});

export default HeaderBar;
