import React, { memo } from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { FaStar, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { BiLoaderCircle } from "react-icons/bi";
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
  const { loading, error } = useSelector((state) => state.cart);

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

    dispatch(incrementQty(item.id));
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

    dispatch(decrementQty(item.id));
  };

  const discount =
    item?.BPrice && item?.PPrice
      ? Math.round(((item.BPrice - item.PPrice) / item.BPrice) * 100)
      : 0;

  return (
    <div className="shrink-0 hover:scale-102 shadow-lg duration-500 group border border-gray-300 rounded-2xl w-fit">
      <div className="w-55 max-[600px]:w-42 flex flex-col items-center p-2">
        <div className="w-55 max-[600px]:w-40 relative rounded-2xl overflow-hidden">
          {/* Wishlist */}
          <button className="absolute right-2 top-2 z-1 rounded-full bg-white/50 border border-gray-200 p-3 cursor-pointer">
            <FaRegHeart />
          </button>

          {/* Product Image */}
          <div className="h-67 max-[600px]:h-45 overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center">
            <img
              src={`/image/product_img/${item?.image?.image_name}`}
              alt={item?.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Rating */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-green-700">
            <span className="text-[10px]">
              {item?.review?.average_rating || "1"}
            </span>
            <FaStar className="rotate-12" size={10} />
          </div>

          {/* Cart Button */}
          <div className="absolute left-2 bottom-2 opacity-0 translate-y-10 group-hover:flex group-hover:opacity-100 group-hover:translate-y-0 duration-700">
            <div className="relative">
              {isInCart ? (
                <>
                  <div className="bg-green-600 grid grid-cols-3 place-items-center text-white h-10 w-20 rounded-lg transition-all duration-200">
                    <button
                      type="button"
                      className="h-full w-full flex items-center justify-center hover:scale-90 cursor-pointer"
                      onClick={handleDecrement}
                      disabled={loading}
                    >
                      <IoMdRemove />
                    </button>

                    <span>{currentQty}</span>

                    <button
                      type="button"
                      className="h-full w-full flex items-center justify-center hover:scale-90 cursor-pointer"
                      onClick={handleIncrement}
                      disabled={loading}
                    >
                      <IoMdAdd />
                    </button>

                    {loading && (
                      <div className="absolute bg-white/30 text-gray-600 rounded-lg w-full h-full flex justify-center items-center">
                        <BiLoaderCircle className="animate-spin" size={22} />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="relative flex w-20 h-10 text-green-600 border border-green-600 rounded-lg hover:scale-105 duration-200  bg-white/80 justify-center items-center">
                  <button
                    type="button"
                    className="w-full h-full cursor-pointer"
                    onClick={handleAdd}
                    disabled={loading}
                  >
                    Add
                  </button>
                  {loading && (
                    <div className="absolute bg-gray-100/40 text-gray-600 rounded-lg w-full h-full flex justify-center items-center">
                      <BiLoaderCircle className="animate-spin" size={22} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full space-y-1 p-2">
          <div className="flex justify-between">
            <div className="truncate line-clamp-1 text-blue-600">
              {item?.brand ?? "Brand"}
            </div>
          </div>

          <div className="line-clamp-2 h-12">
            <span>{item?.name}</span>
          </div>

          <div className="flex items-end space-x-2">
            <div className="flex gap-2 max-[600px]:flex-col max-[600px]:gap-0">
              <span>₹{item?.PPrice}</span>

              <span className="line-through text-gray-400">
                ₹{item?.BPrice}
              </span>
            </div>

            <div>
              <span className="text-green-600 text-[14px]">
                {discount}% off
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
