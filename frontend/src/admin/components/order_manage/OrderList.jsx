import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineVisibility } from "react-icons/md";
import DataTable from "../common/DataTable";
import OrderSearch from "./OrderSearch";
import Modal from "../../../components/common/Modal";
import {
  changeOrderStatusAPI,
  getOrderAPI,
} from "../../../features/orders/orderThunk";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_CHIP_COLOR = {
  pending: "default",
  confirmed: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const shortId = (id) => (id ? String(id).slice(0, 8).toUpperCase() : "—");

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.order) ?? [];
  const loading = useSelector((state) => state.orders?.loading);
  const error = useSelector((state) => state.orders?.error);

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(getOrderAPI())
      .unwrap()
      .catch((err) => {
        toast.error(err || "Failed to load orders");
      });
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((item) => {
      const statusMatch =
        statusFilter === "All" ? true : item?.status === statusFilter;

      const searchMatch =
        query === ""
          ? true
          : item?.id?.toLowerCase().includes(query) ||
            item?.user?.username?.toLowerCase().includes(query) ||
            item?.user?.email?.toLowerCase().includes(query) ||
            item?.address?.city?.toLowerCase().includes(query) ||
            item?.address?.userName?.toLowerCase().includes(query);

      return statusMatch && searchMatch;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleStatusChange = async (orderId, status) => {
    if (!orderId || !status) return;
    setUpdatingId(orderId);
    try {
      await dispatch(changeOrderStatusAPI({ order_id: orderId, status })).unwrap();
      toast.success("Order status updated");
      if (detailOrder?.id === orderId) {
        setDetailOrder((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err) {
      toast.error(err || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      width: 120,
      renderCell: (params) => (
        <span className="font-medium text-gray-700">{shortId(params.value)}</span>
      ),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      minWidth: 160,
      valueGetter: (_value, row) =>
        row?.user?.username || row?.address?.userName || "—",
      renderCell: (params) => (
        <div className="flex flex-col justify-center h-full leading-tight">
          <span className="text-sm text-gray-800">
            {params.row?.user?.username || params.row?.address?.userName || "—"}
          </span>
          <span className="text-xs text-gray-400">
            {params.row?.user?.email || ""}
          </span>
        </div>
      ),
    },
    {
      field: "items",
      headerName: "Items",
      width: 90,
      valueGetter: (_value, row) => row?.order_item?.length || 0,
      renderCell: (params) => params.row?.order_item?.length || 0,
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
      valueGetter: (_value, row) => row?.address?.city || "—",
    },
    {
      field: "total_amount",
      headerName: "Total",
      width: 110,
      renderCell: (params) =>
        params.value != null ? `₹${Number(params.value).toFixed(2)}` : "—",
    },
    {
      field: "create_at",
      headerName: "Date",
      width: 130,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 170,
      renderCell: (params) => (
        <div className="flex items-center gap-1 h-full">
          <div className="relative flex items-center border border-gray-200 rounded-lg px-2 h-8">
            <select
              value={params.value || "pending"}
              disabled={updatingId === params.row.id}
              onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
              className="appearance-none outline-none bg-transparent text-xs capitalize cursor-pointer pr-4"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <IoIosArrowDown className="absolute right-1 text-gray-400 text-xs pointer-events-none" />
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "View",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => setDetailOrder(params.row)}
          title="View order"
        >
          <MdOutlineVisibility className="text-blue-500 text-xl" />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="p-4">
      <OrderSearch
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearch={setSearchQuery}
      />

      <p className="text-sm text-gray-400 mb-4">
        {loading
          ? "Loading orders..."
          : error
            ? `Error: ${error}`
            : `${filteredOrders.length} order${filteredOrders.length !== 1 ? "s" : ""} found`}
      </p>

      <DataTable
        rows={filteredOrders}
        columns={columns}
        getRowId={(row) => row.id}
      />

      <Modal
        open={Boolean(detailOrder)}
        onClose={() => setDetailOrder(null)}
        title={detailOrder ? `Order #${shortId(detailOrder.id)}` : "Order Details"}
        widthClassName="max-w-3xl"
      >
        {detailOrder && (
          <div className="space-y-4 p-2">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <Chip
                label={detailOrder.status}
                color={STATUS_CHIP_COLOR[detailOrder.status] || "default"}
                size="small"
                className="!capitalize"
              />
              <span className="text-sm text-gray-500">
                {formatDate(detailOrder.create_at)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm max-[600px]:grid-cols-1">
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-medium">
                  {detailOrder.user?.username || detailOrder.address?.userName || "—"}
                </p>
                <p className="text-gray-500">{detailOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Shipping</p>
                <p className="font-medium">
                  {[detailOrder.address?.street_area, detailOrder.address?.city]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
                <p className="text-gray-500">
                  {[detailOrder.address?.state, detailOrder.address?.pin_code]
                    .filter(Boolean)
                    .join(" - ")}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-3">
              {(detailOrder.order_item || []).map((item) => {
                const imageName = item?.product?.image?.image_name;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {imageName ? (
                        <img
                          src={`/image/product_img/${imageName}`}
                          alt={item?.product?.name || "product"}
                          className="w-12 h-12 object-contain rounded bg-gray-50"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-300">
                          No img
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item?.product?.name || "Product"}
                        </p>
                        <p className="text-xs text-gray-400">Qty: {item?.qty}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium shrink-0">
                      ₹{Number(item?.line_total || 0).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm text-gray-500">Total amount</span>
              <span className="text-lg font-semibold">
                ₹{Number(detailOrder.total_amount || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Update status</label>
              <div className="relative flex items-center border border-gray-200 rounded-lg px-2 h-9">
                <select
                  value={detailOrder.status || "pending"}
                  disabled={updatingId === detailOrder.id}
                  onChange={(e) =>
                    handleStatusChange(detailOrder.id, e.target.value)
                  }
                  className="appearance-none outline-none bg-transparent text-sm capitalize cursor-pointer pr-5"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <IoIosArrowDown className="absolute right-2 text-gray-400 text-xs pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;
