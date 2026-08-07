import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import ProductCard from "./ProductCard";
import { useDispatch } from "react-redux";
import { setCategory } from "../../features/category/categotySlice";
import { NavLink } from "react-router-dom";

const ProductCardList = ({ product }) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full min-w-0">
      <div className="flex justify-between p-3">
        <h4 className="text-2xl font-semibold">{product?.categoryName}</h4>
        <button
          onClick={() => {
            dispatch(setCategory(product?.categoryName));
          }}
          type="button"
          className="flex cursor-pointer items-center text-[14px] gap-1"
        >
          See All
          <span>
            <FaChevronRight size={10} />
          </span>
        </button>
      </div>
      <div className="flex w-full min-w-0 gap-2 overflow-x-auto px-2 py-4 scrollbar-nonep-2 scrollbar-none">
        {product?.products.map((item) => (
          <NavLink key={item?.id} to={`/product/${item?.id}`}>
            <ProductCard item={item} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ProductCardList;
