import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductAPI,
  ProductGet,
} from "../../features/productAdd/productAddThunk";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { setIsUpdatedProduct } from "../../features/productAdd/productAddSlice";
import { toast } from "react-toastify";
import ProductSearch from "./ProductSearch";
import DeletePopup from "../common/DeletePopup";

const ProductList = ({ setActivePage }) => {
  const Product = useSelector((state) => state.productAdd.products) ?? [];
  const dispatch = useDispatch();

  const [stockFilter, setStockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterProduct = useMemo(() => {
    return Product.filter((item) => {
      const stockMatch =
        stockFilter === "All"
          ? true
          : stockFilter === "InStock"
            ? item?.qty > 10
            : stockFilter === "LowStock"
              ? item?.qty > 0 && item?.qty <= 10
              : item?.qty <= 0;

      const statusMatch =
        statusFilter === "All" ? true : item?.status === statusFilter;

      const seachMatch =
        searchQuery.trim() === ""
          ? true
          : item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return stockMatch && statusMatch && seachMatch;
    });
  }, [Product, stockFilter, searchQuery, statusFilter]);

  const handleUpdateProduct = (item) => {
    dispatch(setIsUpdatedProduct(item));
    setActivePage("Add Product");
  };

  const handleDeleteProduct = async (id) => {
    if (!id) return;
    try {
      await dispatch(deleteProductAPI(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to delete product");
    }
  };

  useEffect(() => {
    dispatch(ProductGet());
  }, [dispatch]);

  return (
    <div className="p-4">
      {/* Filters */}

      <ProductSearch
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearch={setSearchQuery}
      />
      {/* Product Count */}
      <p className="text-sm text-gray-400 mb-4">
        {Product.length} product{Product.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {handleFilterProduct.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-1">
            {Product.length === 0
              ? "Add a product to get started"
              : "Try changing your filters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-[1200px]:grid-cols-3 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1">
          {handleFilterProduct.map((item) => (
            <ProductCard
              key={item?.id}
              item={item}
              handleUpdateProduct={handleUpdateProduct}
              handleDeleteProduct={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ item, handleUpdateProduct, handleDeleteProduct }) => {
  ///pop delete product
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-md transition-shadow bg-white">
      {/* Image */}
      <div className="relative w-full h-44 bg-gray-50 overflow-hidden flex justify-center items-center shadow-inner">
        {item?.image ? (
          <img
            src={`/image/product_img/${item?.image?.image_name}`}
            alt={item?.image?.image_name}
            className="w-fit h-full object-contain p-3 rounded-2xl"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-2 left-2 rounded-full flex items-center justify-center pb-0.5 ${
            item?.status === "public"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-500"
          }`}
        >
          <span className="text-[11px] font-medium px-2 py-0.5 block">
            {item?.status === "public" ? "Published" : "Unpublished"}
          </span>
        </div>

        {/* Action Buttons — show on hover */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleUpdateProduct(item)}
            className="bg-white border cursor-pointer border-gray-200 p-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
            title="Edit"
          >
            <TbEdit className="text-blue-500 text-sm" />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white border cursor-pointer border-gray-200 p-1.5 rounded-full hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
            title="Delete"
          >
            <MdOutlineDelete className="text-red-400 text-sm" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 border-t border-gray-100">
        {/* Category */}
        <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {item?.category ?? "Uncategorized"}
        </span>

        {/* Name */}
        <p className="text-sm font-medium text-gray-800 mt-1.5 line-clamp-2 leading-snug">
          {item?.name}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-base font-semibold text-gray-900">
            {item?.PPrice ? `₹${item.PPrice}` : "—"}
          </p>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              item?.qty > 10
                ? "bg-blue-50 text-blue-500"
                : item?.qty > 0
                  ? "bg-yellow-50 text-yellow-500"
                  : "bg-red-50 text-red-400"
            }`}
          >
            {item?.qty > 10
              ? `${item.qty} in stock`
              : item?.qty > 0
                ? `Low: ${item.qty} left`
                : "Out of stock"}
          </span>
        </div>
      </div>
      {isOpen && (
        <DeletePopup
          onClose={() => setIsOpen(false)}
          handleDelete={() => {
            handleDeleteProduct(item?.id);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
