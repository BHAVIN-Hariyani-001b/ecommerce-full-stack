import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import ProductCard from "./ProductCard";
import { useDispatch } from "react-redux";
import { setCategory } from "../../features/category/categotySlice";

const ProductCardList = ({ product }) => {
  const dispatch = useDispatch(); 
  return (
    <div>
      <div>
        <div className="flex justify-between p-3">
          <h4 className="text-2xl font-semibold">{product?.categoryName}</h4>
          <button
            onClick={() => {dispatch(setCategory(product?.categoryName))}}
            type="button"
            className="flex cursor-pointer items-center text-[14px] gap-1"
          >
            See All
            <span>
              <FaChevronRight size={10} />
            </span>
          </button>
        </div>
      </div>
      <div className="flex mx-auto overflow-auto h-full max-w-screen px-2 scrollbar-none">
        {product?.products.map((item) => (
          <ProductCard key={item?.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardList;
