import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductAPI,
  manageStockAPI,
  ProductGet,
} from "../../features/productAdd/productAddThunk";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { setIsUpdatedProduct } from "../../features/productAdd/productAddSlice";
import { MdOutlineRateReview } from "react-icons/md";
import toast from "react-hot-toast";
import ProductSearch from "./ProductSearch";
import DeletePopup from "../common/DeletePopup";
import DataTable from "../common/DataTable";

import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Modal from "../../../components/common/Modal";
import ProductReview from "../../../components/product/ProductReview";
import { fetchReviewsAPI } from "../../../features/review/ReviewThunk";

const ManageQtyInput = ({ productId, qty, onSave, disabled }) => {
  const [value, setValue] = useState(String(qty ?? 0));

  useEffect(() => {
    setValue(String(qty ?? 0));
  }, [qty]);

  const handleBlur = () => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setValue(String(qty ?? 0));
      toast.error("Enter a valid quantity");
      return;
    }
    if (parsed === qty) return;
    onSave(productId, parsed);
  };

  return (
    <input
      type="number"
      min={0}
      value={value}
      disabled={disabled}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      onClick={(e) => e.stopPropagation()}
      className="w-20 h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400 disabled:opacity-50"
    />
  );
};

const ProductList = ({ setActivePage }) => {
  const Product = useSelector((state) => state.productAdd?.products) ?? [];
  const dispatch = useDispatch();

  const [stockFilter, setStockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null); // for popup
  const [savingQtyId, setSavingQtyId] = useState(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [productId, setProductwId] = useState(null);

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
    } finally {
      setDeleteId(null);
    }
  };

  const handleManageQty = useCallback(
    async (id, newqty) => {
      if (!id) return;
      setSavingQtyId(id);
      try {
        await dispatch(manageStockAPI({ id, newqty })).unwrap();
        toast.success("Stock updated");
      } catch (err) {
        toast.error(err || "Failed to update stock");
      } finally {
        setSavingQtyId(null);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(ProductGet());
  }, [dispatch]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviewsAPI(productId)).unwrap();
    }
  }, [productId, dispatch]);

  const handleOpenReview = useCallback((id) => {
    setReviewOpen(true);
    setProductwId(id);
  }, []);

  const handleCloseReview = useCallback(() => setReviewOpen(false), []);

  const columns = useMemo(
    () => [
      {
        field: "image",
        headerName: "Image",
        width: 90,
        sortable: false,
        renderCell: (params) =>
          params.row?.image?.image_name ? (
            <img
              src={`/image/product_img/${params.row.image.image_name}`}
              alt={params.row.image.image_name}
              className="w-10 rounded-sm p-0.5 h-full object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-[10px]">
              No image
            </div>
          ),
      },
      { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
      { field: "category", headerName: "Category", width: 130 },
      {
        field: "PPrice",
        headerName: "Price",
        width: 100,
        renderCell: (params) => (params.value ? `₹${params.value}` : "—"),
      },
      {
        field: "qty",
        headerName: "Stock",
        width: 140,
        renderCell: (params) => {
          const qty = params.value;
          const label =
            qty > 10
              ? `${qty} in stock`
              : qty > 0
                ? `Low: ${qty} left`
                : "Out of stock";
          const color = qty > 10 ? "info" : qty > 0 ? "warning" : "error";
          return <Chip label={label} color={color} size="small" />;
        },
      },
      {
        field: "manageQty",
        headerName: "Manage Qty",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const id = params.row?._id || params.row?.id;
          return (
            <div className="flex items-center h-full">
              <ManageQtyInput
                productId={id}
                qty={params.row?.qty}
                onSave={handleManageQty}
                disabled={savingQtyId === id}
              />
            </div>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <Chip
            label={params.value === "public" ? "Published" : "Unpublished"}
            color={params.value === "public" ? "success" : "default"}
            size="small"
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <div className="flex gap-1 items-center justify-center h-full">
            <IconButton
              size="small"
              onClick={() => handleUpdateProduct(params.row)}
              title="Edit"
            >
              <TbEdit className="text-blue-500 text-xl hover:scale-105 duration-100" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteId(params.row?._id || params.row?.id)}
              title="Delete"
            >
              <MdOutlineDelete className="text-red-400 text-xl hover:scale-105 duration-100" />
            </IconButton>
          </div>
        ),
      },
      {
        field: "review",
        headerName: "Review",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <IconButton
            size="small"
            onClick={() => handleOpenReview(params.row?._id || params.row?.id)}
            title="Review"
          >
            <MdOutlineRateReview className="text-blue-400 text-xl hover:scale-105 duration-100" />
          </IconButton>
        ),
      },
    ],
    [handleManageQty, handleOpenReview, savingQtyId],
  );

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

      <DataTable
        rows={handleFilterProduct}
        columns={columns}
        getRowId={(row) => row._id || row.id}
      />

      {deleteId && (
        <DeletePopup
          onClose={() => setDeleteId(null)}
          handleDelete={() => handleDeleteProduct(deleteId)}
        />
      )}

      <Modal
        open={reviewOpen}
        onClose={handleCloseReview}
        title="Manage Review"
        widthClassName="max-w-7xl"
      >
        <ProductReview productId={productId} />
      </Modal>
    </div>
  );
};

export default ProductList;
