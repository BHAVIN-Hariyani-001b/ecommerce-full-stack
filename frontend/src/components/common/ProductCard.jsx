import React from "react";

const ProductCard = ({ item }) => {
  console.log(item)
  return (
    <div>
      <div className="p-2 w-45 rounded-xl">
        <div className="flex h-55 items-center justify-center border border-gray-200 px-1 rounded-2xl">
          <img
            src={`../../../public/image/product_img/${item?.image?.image_name}`}
            alt={item?.name}
            loading="lazy"
            className="max-h-50 h-fit rounded-2xl object-contain"
          />
        </div>
        <div className="p-1 space-y-3">
          <div className="text-[14px] text-left line-clamp-2">
            <span>{item?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-x-2 flex flex-col">
              <span className="text-[16px]">{item?.PPrice}</span>
              <span className="text-[13px] line-through text-gray-400">
                {item?.BPrice}
              </span>
            </div>
            <div>
              <button
                type="button"
                className="cursor-pointer text-green-600 border border-green-600 rounded-lg px-5 py-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
