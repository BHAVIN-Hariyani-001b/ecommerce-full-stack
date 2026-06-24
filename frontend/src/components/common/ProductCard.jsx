import React, { memo } from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addGuestCartItem,
  decrementQty,
  incrementQty,
} from "../../features/card/cardSlice";
import {
  addToCart,
  decrementCartItem,
  incrementCartItem,
} from "../../features/card/cardThunk";

const findCartLine = (cartItems, productId) =>
  cartItems.find(
    (line) =>
      line.id === productId ||
      line.product_id === productId ||
      line.product?.id === productId,
  );

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart?.items) ?? [];

  const cartLine = findCartLine(cartItems, item?.id);
  const isInCart = Boolean(cartLine);
  const currentQty = cartLine?.qty ?? 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn && user?.id) {
      dispatch(
        addToCart({
          user_id: user.id,
          product_id: item.id,
        }),
      );
      return;
    }
    dispatch(addGuestCartItem(item));
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn && user?.id && cartLine?.cart_id) {
      dispatch(
        incrementCartItem({
          cart_id: cartLine.cart_id,
          user,
        }),
      );
      return;
    }
    dispatch(incrementQty(item?.id));
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn && user?.id && cartLine?.cart_id) {
      dispatch(
        decrementCartItem({
          cart_id: cartLine.cart_id,
          user,
        }),
      );
      return;
    }
    dispatch(decrementQty(item?.id));
  };

  return (
    <div className="shrink-0">
      <div className="p-2 w-45 max-[400px]:w-40 rounded-xl">
        <div className="flex h-55 max-[400px]:h-40 group items-center justify-center border border-gray-200 px-1 rounded-2xl">
          <img
            src={`../../../public/image/product_img/${item?.image?.image_name}`}
            alt={item?.name}
            loading="lazy"
            className="max-h-50 max-[400px]:h-35 h-fit rounded-2xl object-contain group-hover:scale-105 duration-300 ease-in-out"
          />
        </div>
        <div className="p-1 space-y-3">
          <div className="text-[14px] text-left line-clamp-2">
            <span>{item?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-x-2 flex flex-col">
              <span className="text-[16px]">&#8377;{item?.PPrice}</span>
              <span className="text-[13px] line-through text-gray-400">
                &#8377;{item?.BPrice}
              </span>
            </div>
            <div className="group">
              {isInCart ? (
                <div className="bg-green-600 grid grid-cols-3 duration-150 ease-in-out group-hover:scale-105 place-items-center text-white h-10 w-20 max-[400px]:w-19 rounded-lg">
                  <button
                    type="button"
                    className="h-full place-items-center w-full cursor-pointer hover:scale-90"
                    onClick={handleDecrement}
                  >
                    <IoMdRemove />
                  </button>
                  <p>{currentQty}</p>
                  <button
                    type="button"
                    className="h-full w-full place-items-center cursor-pointer hover:scale-90"
                    onClick={handleIncrement}
                  >
                    <IoMdAdd />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="cursor-pointer text-green-600 border border-green-600 hover:scale-101 rounded-lg w-20 max-[400px]:w-19 h-10"
                  onClick={handleAdd}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
