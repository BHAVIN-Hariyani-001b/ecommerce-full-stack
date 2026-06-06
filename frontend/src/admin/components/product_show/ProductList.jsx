import React, { useEffect } from "react";
import Search from "../../../components/common/Search";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { ProductGet } from "../../features/productAdd/productAddThunk";
import { TbEdit } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";

const ProductList = () => {
  const Product =
  useSelector((state) => state.productAdd.products.products) ?? [];
  console.log(Product[0]?.image?.image_name);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(ProductGet());
    })();
  }, []);

  return (
    <div>
      <div className="flex w-full items-center justify-center">
        <form
          action=""
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-3 place-content-center w-full gap-4 py-4"
        >
          <div className="flex items-center justify-center border border-gray-200 rounded-xl h-12 p-2 cursor-pointer">
            <select
              name="stock"
              id="Stock"
              className="appearance-none outline-none w-full h-full cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
            </select>
            <IoIosArrowDown className="" />
          </div>
          <div className="flex items-center justify-center border border-gray-200 rounded-xl h-12 p-2 cursor-pointer">
            <select
              name="Status"
              id="status"
              className="appearance-none outline-none w-full h-full cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
            </select>
            <IoIosArrowDown className="" />
          </div>
          <div className="">
            <Search />
          </div>
        </form>
      </div>
      <div className="space-y-2 h-100 overflow-auto scrollbar">
        {Product.map((item,index)=>(
          <PList key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

const PList = ({ item }) => {
  return (
    <div className="border border-gray-200 rounded-xl flex items-center justify-between p-4 group cursor-pointer">
      <div className="flex gap-5">
        <div className="w-15 h-15 border border-gray-200 rounded">
          {item.image ? (
            <img
              src={`../../../../public/image/product_img/${item?.image?.image_name}`}
              alt={item?.image?.image_name}
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-[16px]">{item?.name}</p>
          <p className={`text-[12px] bg-gray-100 px-1 w-fit rounded-full `}>
            {item?.category}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-5 text-xl">
        <button className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 hover:scale-105 p-1 rounded-full">
          <TbEdit />
        </button>
        <button className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 p-1 hover:scale-105 rounded-full">
          <MdOutlineDelete />
        </button>
        <div className="group-hover:translate-x-2 transition-all">
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
