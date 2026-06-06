import Search from "../../../components/common/Search";
import PageWapper from "../../../components/layout/PageWapper";
import { AiOutlineProduct } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import ProductList from "./ProductList";

const Product = ({ setActivePage }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <PageWapper className={"h-full w-full px-4 py-4"}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2 max-[600px]:text-xl">
            <AiOutlineProduct className="inline-block" />
            <span>Product List</span>
          </h1>
          <button type="button" onClick={()=>setActivePage("Add Product")} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 font-semibold max-[600x]:text-[24px]">
            <span className="max-[600px]:text-[14px]">Add Product</span>
          </button>
        </div>
        <ProductList />
      </PageWapper>
    </div>
  );
};

export default Product;
