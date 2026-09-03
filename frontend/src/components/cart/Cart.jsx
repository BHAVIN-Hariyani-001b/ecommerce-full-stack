import { memo, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { RiFileList2Fill } from "react-icons/ri";
import { IoBagHandle, IoArrowForward } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { BiLoaderCircle } from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";
import {
  decrementCartItem,
  incrementCartItem,
} from "../../features/card/cardThunk";
import { decrementQty, incrementQty } from "../../features/card/cardSlice";
import { setAuthOpen, setAuthView } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import BillDetails from "./BillDetails";

const Cart = ({ sideBarOpen, setSideBar, checkOut, setCheckOut }) => {
  const items = useSelector((state) => state.cart.items) ?? [];
  // console.log(items);
  const { basePrice, totalPrice, finalPrice, deliveryCharge, handlingCharge } =
    useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();

  const handleOpenCheckOut = useCallback(() => {
    if (items.length === 0) {
      toast("Your cart is empty. Please add items !", {
        icon: <IoIosWarning className="text-yellow-500" size={40} />,
        style: { background: "#fef3c7", color: "#92400e" },
      });

      return;
    }

    if (!user) {
      dispatch(setAuthView("signin"));
      dispatch(setAuthOpen(true));
      return;
    }
    setCheckOut(true);
  }, [setCheckOut, user, dispatch, items.length]);

  return (
    <>
      <div
        onClick={() => setSideBar(false)}
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${sideBarOpen ? "opacity-100 pointer-events-  auto" : "opacity-0 pointer-events-none"}`}
      />

      <aside
        className={`h-full w-100 max-[600px]:w-screen space-y-6 max-[600px]:rounded-l-none fixed right-0 top-0 z-30 bg-gray-100 border-gray-300 rounded-l-xl
          transition-all duration-300 ease-in-out
          ${sideBarOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="text-xl w-full flex items-center mx-5 py-2 mt-2 bg-white rounded-l-full">
          <div className="flex justify-start items-center gap-5 w-full px-3 relative">
            <button
              onClick={() => setSideBar(false)}
              className="p-3 rounded-full hover:bg-gray-200 transition-all duration-300 cursor-pointer"
            >
              <FaArrowLeft
                size={20}
                className="hover:-translate-x-0.5 transition-all duration-300"
              />
            </button>
            <h4 className="font-semibold text-[18px]">My Cart</h4>
            <div className="absolute right-10">
              <MdOutlineShoppingCart className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 space-y-2 px-2 py-4 mx-2 max-[600px]:rounded-xl h-screen shadow-inner pb-60 overflow-scroll scrollbar-none">
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Your cart is empty
              </p>
            ) : (
              items.map((item, index) => (
                <CartProduct key={index} item={item} />
              ))
            )}
          </div>
          <BillDetails />
        </div>
        <div
          className="flex items-center w-[90%] justify-center group text-white cursor-pointer bg-green-600 py-5 rounded-r-full mr-5 absolute bottom-2"
          onClick={handleOpenCheckOut}
        >
          <div className="flex items-center gap-3 justify-center">
            <h2 className="text-[18px]">Continue To Process</h2>
            <IoArrowForward
              size={25}
              className="group-hover:translate-x-10 pt-1 duration-500"
            />
          </div>
        </div>
      </aside>
    </>
  );
};

const CartProduct = ({ item }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loadingCartId, error } = useSelector((state) => state.cart);
  const product = item?.product || item;
  const name = product?.name;
  const pPrice = product?.PPrice;
  const bPrice = product?.BPrice;
  const imageName = product?.image?.image_name;
  console.log(product?.image);

  console.log(item);

  const handleIncrement = () => {
    if (user && item?.cart_id) {
      dispatch(incrementCartItem({ cart_id: item.cart_id, user }));
    } else {
      dispatch(incrementQty(item?.id));
    }
  };

  const handleDecrement = () => {
    if (user && item?.cart_id) {
      dispatch(decrementCartItem({ cart_id: item.cart_id, user }));
    } else {
      dispatch(decrementQty(item?.id));
    }
  };

  return (
    <div className="flex justify-between mx-2 rounded-xl p-2 gap-1 bg-white">
      <div className="flex gap-5">
        <div className="w-18 h-18">
          <img
            src={`../../../public/image/product_img/${imageName}`}
            alt={name}
            loading="lazy"
            className="w-full h-full p-1 border border-gray-200 object-contain rounded-sm"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-30 min-w-full wrap-break-word line-clamp-1 font-light">
            {name}
          </div>

          <div className="text-[12px] flex flex-col justify-start w-full">
            {(item.cart_value ?? []).map((values, index) =>
              values?.value?.charAt(0) === "#" ? (
                <span className="flex items-center" key={index}>
                  {values.name} :
                  <span
                    style={{ backgroundColor: values.value }}
                    className="inline-block w-5 mx-2 h-5 rounded-full border border-gray-300"
                  />
                  {values.value}
                </span>
              ) : (
                <span key={index}>
                  {values?.name} : {values?.value}
                </span>
              ),
            )}
          </div>
          <div className="space-x-2 items-start w-full">
            <span className="text-[14px] font-semibold">&#8377;{pPrice}</span>
            <span className="text-[12px] line-through text-gray-400">
              &#8377;{bPrice}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-2 items-center">
        <div className="bg-green-600 grid grid-cols-3 place-items-center text-white h-9 w-20 max-[400px]:w-15 rounded-lg relative">
          <button
            className="h-full cursor-pointer hover:scale-90"
            onClick={handleDecrement}
          >
            <IoMdRemove />
          </button>
          <p>{item?.qty}</p>
          <button
            className="h-full cursor-pointer hover:scale-90"
            onClick={handleIncrement}
          >
            <IoMdAdd />
          </button>
          {loadingCartId === item?.cart_id && (
            <div className="absolute bg-white/30 text-gray-600 rounded-lg w-full h-full flex justify-center items-center">
              <BiLoaderCircle className="animate-spin" size={22} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Cart);
