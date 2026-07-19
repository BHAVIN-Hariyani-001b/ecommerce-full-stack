import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import Search from "../../../components/common/Search";

const ProductSearch = ({
  stockFilter,
  setStockFilter,
  statusFilter,
  setStatusFilter,
  onSearch,
}) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-3 w-full gap-4 py-4 max-[600px]:flex max-[600px]:flex-col"
    >
      {/* Stock Filter */}
      <div className="flex items-center border border-gray-200 rounded-xl h-12 px-3">
        <select
          name="stock"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="appearance-none outline-none w-full h-full cursor-pointer bg-transparent text-sm p-2"
        >
          <option value="All">All Stock</option>
          <option value="InStock">In Stock</option>
          <option value="LowStock">Low Stock</option>
          <option value="OutOfStock">Out Of Stock</option>
        </select>
        <IoIosArrowDown className="shrink-0 text-gray-400" />
      </div>

      {/* Status Filter */}
      <div className="flex items-center border border-gray-200 rounded-xl h-12 px-3">
        <select
          name="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none outline-none w-full h-full cursor-pointer bg-transparent text-sm p-2"
        >
          <option value="All">All Status</option>
          <option value="public">Published</option>
          <option value="private">Unpublished</option>
        </select>
        <IoIosArrowDown className="shrink-0 text-gray-400" />
      </div>

      {/* Search */}
      <Search onSearch={onSearch} />
    </form>
  );
};

export default ProductSearch;