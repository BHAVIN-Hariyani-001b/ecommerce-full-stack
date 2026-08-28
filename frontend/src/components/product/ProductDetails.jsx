import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementCartItem,
  incrementCartItem,
} from "../../features/card/cardThunk";
import {
  addGuestCartItem,
  decrementQty,
  incrementQty,
} from "../../features/card/cardSlice";

import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { BiLoaderCircle } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";

const findCartLine = (cartItems, productId) =>
  cartItems.find(
    (line) =>
      line.id === productId ||
      line.product_id === productId ||
      line.product?.id === productId,
  );

const ProductDetails = () => {
  const product = useSelector((state) => state.product.product);
  const rating = useSelector(
    (state) => state.review?.review_summary?.average_rating,
  );

  console.log(product);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart?.items) ?? [];
  const { loadingProductId, loadingCartId, error } = useSelector(
    (state) => state.cart,
  );

  const cartLine = findCartLine(cartItems, product?.id);
  const isInCart = Boolean(cartLine);
  const currentQty = cartLine?.qty ?? 0;


  const [productAttributes, setProductAttributes] = useState({
    Color: [],
    Size: [],
    Text: [],
    Number: [],
  });

  const filterData = () => {
    const grouped = { Color: [], Size: [], Text: [], Number: [] };

    (product?.attributes ?? []).forEach((item) => {
      if (grouped[item?.name]) {
        grouped[item.name].push(item);
      } else {
        grouped.Text.push(item); // fallback bucket for unknown types
      }
    });

    setProductAttributes(grouped);
  };


  useEffect(() => {
    filterData();
  }, [product]);

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const selectedAttributesValueIds = Object.values(selectedAttributes);

  useEffect(() => {
    if (!product?.attributes?.length) return;
    console.log(selectedAttributes);
    const defaults = {};

    product?.attributes?.forEach((item) => {
      if (!(item.a_id in defaults)) {
        defaults[item.a_id] = item.id;
      }
    });

    setSelectedAttributes(defaults);
  }, [product?.id]);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Hello bhavin");
    console.log("hi" + selectedAttributesValueIds);
    console.log(selectedAttributes);

    if (isLoggedIn && user?.id) {
      dispatch(
        addToCart({
          user_id: user.id,
          product_id: product.id,
          attributes_value_ids: selectedAttributesValueIds,
        }),
      );
      return;
    }

    dispatch(addGuestCartItem({ ...product, selectedAttributesValueIds }));
  };

  const handleSelectAttribute = (a_id, attribute_value_id) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [a_id]: attribute_value_id,
    }));
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
    console.log(product);
    dispatch(incrementQty(product.id));
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

    dispatch(decrementQty(product.id));
  };

  return (
    <>
      <div className="border border-gray-200 h-150 max-h-full w-full rounded-2xl p-5">
        {/* this is the product all info */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center">
              <div className="">
                {product?.brand && (
                  <div className="text-blue-700 font-normal text-[15px]">
                    {product?.brand ? product?.brand.toUpperCase() : "No Brand"}
                  </div>
                )}
              </div>
              <div className="flex gap-1 items-center bg-green-200 text-green-700 px-2 py-1 rounded-full">
                <span className="text-[12px]">{rating || 1}</span>
                <FaStar size={15} className="rotate-10" />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-gray-400 text-[14px]">
                {product?.category ? product?.category : "No Category"}
              </span>
            </div>
          </div>
          <div className="line-clamp-4 text-2xl">{product?.name}</div>
          <div className="">
            <div className="space-x-2 flex">
              <div className="text-3xl flex gap-2 items-center">
                <span className="text-xl font-medium">&#8377;</span>{" "}
                {product?.PPrice}
              </div>
              <div className="text-white text-[14px] pb-0.5 items-end font-bold flex gap-1">
                <div className="bg-green-700 py-0.5 px-1 rounded">
                  <span>{product?.discount}% </span>
                  <span>OFF</span>
                </div>
              </div>
            </div>
            <div className="text-gray-400 pl-1 space-x-2">
              <span className="line-through">&#8377; {product?.BPrice}</span>
              <span>MRP (include with text)</span>
            </div>
          </div>
          <div>
            <div className="flex gap-10 w-full flex-wrap">
              {Object.entries(productAttributes).map(
                ([name, items]) =>
                  items.length > 0 && (
                    <div key={name} className="flex flex-col gap-2">
                      <span className="text-sm font-medium">{name}</span>
                      <div className="flex gap-2">
                        {items.map((item) => {
                          const isSelected =
                            selectedAttributes[item.a_id] === item.id;

                          return (
                            <span
                              key={item.id}
                              onClick={() =>
                                handleSelectAttribute(item.a_id, item.id)
                              }
                              className={`w-10 h-10 flex shadow-2xl rounded-md border justify-center items-center cursor-pointer
                          ${isSelected ? "border-blue-600 border-2" : "border-gray-200"}`}
                              style={
                                name === "Color"
                                  ? {
                                      backgroundColor: item?.value,
                                      borderRadius: "50%",
                                    }
                                  : undefined
                              }
                            >
                              {name !== "Color" && item?.value}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
          <div>
            <div
              className="p-1 text-wrap "
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className=" text-black border border-gray-300 py-3 rounded-lg cursor-pointer hover:scale-102 duration-200"
              >
                Buy Product
              </button>
              {isInCart ? (
                <div className="bg-green-600 relative grid grid-cols-3 place-items-center text-white rounded-lg transition-all duration-200">
                  <button
                    type="button"
                    className="h-full w-full flex items-center justify-center hover:scale-90 cursor-pointer"
                    onClick={handleDecrement}
                    disabled={loadingCartId}
                  >
                    <IoMdRemove />
                  </button>

                  <span>{currentQty}</span>

                  <button
                    type="button"
                    className="h-full w-full flex items-center justify-center hover:scale-90 cursor-pointer"
                    onClick={handleIncrement}
                    disabled={loadingCartId}
                  >
                    <IoMdAdd />
                  </button>

                  {loadingCartId && (
                    <div className="absolute bg-white/30 text-gray-600 rounded-lg w-full h-full flex justify-center items-center">
                      <BiLoaderCircle className="animate-spin" size={22} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative flex text-white bg-blue-700 border rounded-lg hover:scale-102 duration-200  justify-center items-center">
                  <button
                    type="button"
                    className="w-full h-full cursor-pointer"
                    onClick={handleAdd}
                    disabled={loadingProductId}
                  >
                    Add To Cart
                  </button>
                  {loadingProductId && (
                    <div className="absolute bg-gray-100/40 text-gray-600 border border-gray-100/40 rounded-lg w-full h-full flex justify-center items-center">
                      <BiLoaderCircle className="animate-spin" size={22} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
