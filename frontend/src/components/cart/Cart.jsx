import React, { memo } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdDeliveryDining } from "react-icons/md";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { RiFileList2Fill, RiEBikeFill } from "react-icons/ri";
import { IoBagHandle, IoArrowForward } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementCartItem,
  incrementCartItem,
} from "../../features/card/cardThunk";
import { decrementQty, incrementQty } from "../../features/card/cardSlice";

const Cart = ({ sideBarOpen, setSideBar }) => {
  const items = useSelector((state) => state.cart.items) ?? [];
  // console.log(items);
  const { basePrice, totalPrice, finalPrice, deliveryCharge, handlingCharge } =
    useSelector((state) => state.cart);
  return (
    <>
      <div
        onClick={() => setSideBar(false)}
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${sideBarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
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
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              items.map((item) => (
                <CartProduct
                  key={item?.cart_id || item?.id}
                  item={item}
                />
              ))
            )}
          </div>
          <div className="bg-white mx-2 p-3 rounded-xl">
            <div>
              <h3 className="font-semibold text-[18px] py-2">Bill Details</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex justify-center gap-2 items-center text-[14px]">
                  <RiFileList2Fill size={14} />
                  <div className="flex justify-center items-center space-x-2">
                    <span>items total</span>
                    <span className="text-[10px] bg-blue-100 p-0.5 rounded text-blue-800">
                      saved $54
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <span>&#8377;{totalPrice}</span>
                  <span className="line-through text-gray-400">
                    &#8377;{basePrice}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex justify-center gap-2 items-center text-[14px]">
                  <MdDeliveryDining size={14} />
                  <div className="flex justify-center items-center space-x-2">
                    <span>Delivery charge</span>
                  </div>
                </div>
                <div className="space-x-2">
                  <span className="text-blue-600">FREE</span>
                  <span className="line-through text-gray-400">
                    &#8377;{deliveryCharge}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex justify-center gap-2 items-center text-[14px]">
                  <IoBagHandle size={14} />
                  <div className="flex justify-center items-center space-x-2">
                    <span>Handling charge</span>
                  </div>
                </div>
                <div className="space-x-2">
                  <span>&#8377;{handlingCharge}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-dashed border-gray-200 mt-2">
              <div className="flex justify-between">
                <span>Total</span>
                <span>&#8377;{finalPrice}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center w-[90%] justify-center group text-white cursor-pointer bg-green-600 py-5 rounded-r-full mr-5 absolute bottom-2">
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
  const product = item?.product || item;
  const name = product?.name;
  const pPrice = product?.PPrice;
  const bPrice = product?.BPrice;
  const imageName = product?.image?.image_name;
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
            className="w-full h-full p-1 border border-gray-200 object-cover rounded-sm"
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="w-30 wrap-break-word line-clamp-1 font-light">{name}</p>
          <div className="space-x-2 items-start w-full">
            <span className="text-[14px] font-semibold">&#8377;{pPrice}</span>
            <span className="text-[12px] line-through text-gray-400">
              &#8377;{bPrice}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-2 items-center">
        <div className="bg-green-600 grid grid-cols-3 place-items-center text-white h-9 w-20 max-[400px]:w-15 rounded-lg">
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
        </div>
      </div>
    </div>
  );
};

export default memo(Cart);
