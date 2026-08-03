import React from "react";
import { TbReplace, TbTruckDelivery } from "react-icons/tb";
import { LuBadgeIndianRupee } from "react-icons/lu";


const ProductService = () => {
  return (
    <div>
      <div className="p-2">
        <div className="p-2 border border-gray-200 rounded-2xl flex justify-around">
          <div className="w-40 p-3 rounded-2xl grid grid-rows-2 place-items-center place-content-center">
            <TbReplace size={50} />
            <div className="text-center">
              <p>10 days Service Centre Replacement</p>
            </div>
          </div>
          <div className="w-40 p-3 rounded-2xl grid grid-rows-2 place-items-center place-content-center">
            <TbTruckDelivery size={50} />
            <div className="text-center">
              <p>Free Delivery</p>
            </div>
          </div>
          <div className="w-40 p-3 rounded-2xl grid grid-rows-2 place-items-center place-content-center">
            <LuBadgeIndianRupee size={50} />
            <div className="text-center">
              <p>Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductService;
