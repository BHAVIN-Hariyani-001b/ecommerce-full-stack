import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineVisibility } from "react-icons/md";
import DataTable from "../common/DataTable";
import PaymentSerch from "./PaymentSerch";
import Modal from "../../../components/common/Modal";
import {
  paymentDataFetchAPI,
  paymentStatusChangeAPI,
} from "../../features/payment/paymentThunk";

const STATUS_OPTIONS = ["pending", "success", "failed", "refunded"];
const STATUS_COLOR = {
  pending: "warning",
  success: "success",
  failed: "error",
  refunded: "default",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
};

const shortId = (id) => (id ? String(id).slice(0, 8).toUpperCase() : "—");

const PaymentList = () => {
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payment?.paymentData) ?? [];
  const loading = useSelector((state) => state.payment?.loading);
  const error = useSelector((state) => state.payment?.error);
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailPayment, setDetailPayment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(paymentDataFetchAPI())
      .unwrap()
      .catch((err) => toast.error(err || "Failed to load payments"));
  }, [dispatch]);

  const filteredPayments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return payments.filter((payment) => {
      const searchableText = [
        payment.id,
        payment.order_id,
        payment.user_id,
        payment.user?.username,
        payment.user?.email,
        payment.razorpay_order_id,
        payment.razorpay_payment_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (statusFilter === "All" || payment.status === statusFilter) &&
        (methodFilter === "All" || payment.method === methodFilter) &&
        (!query || searchableText.includes(query))
      );
    });
  }, [payments, statusFilter, methodFilter, searchQuery]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const response = await dispatch(
        paymentStatusChangeAPI({ id, status }),
      ).unwrap();
      const updatedPayment = response?.data;
      if (detailPayment?.id === id && updatedPayment) {
        setDetailPayment(updatedPayment);
      }
      toast.success("Payment status updated");
    } catch (err) {
      toast.error(err || "Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Payment ID",
      width: 125,
      renderCell: (params) => (
        <span className="font-medium">{shortId(params.value)}</span>
      ),
    },
    {
      field: "order_id",
      headerName: "Order ID",
      width: 125,
      renderCell: (params) => <span>{shortId(params.value)}</span>,
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      minWidth: 170,
      valueGetter: (_value, row) => row.user?.username || row.user?.email || "—",
      renderCell: (params) => (
        <div className="flex h-full flex-col justify-center leading-tight">
          <span className="text-sm">{params.row.user?.username || "—"}</span>
          <span className="text-xs text-gray-400">{params.row.user?.email || ""}</span>
        </div>
      ),
    },
    {
      field: "method",
      headerName: "Method",
      width: 105,
      renderCell: (params) => (
        <span className="uppercase">{params.value || "—"}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => (
        <div className="flex items-center gap-1 h-full">
          <div className="relative flex items-center border border-gray-200 rounded-lg px-2 h-8">
            <select
              value={params.value || "pending"}
              disabled={updatingId === params.row.id}
            onChange={(event) =>
              handleStatusChange(params.row.id, event.target.value)
            }
            className="cursor-pointer appearance-none bg-transparent pr-5 text-xs capitalize outline-none"
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
      field: "amount_paid",
      headerName: "Paid",
      width: 110,
      renderCell: (params) => (
        <span className="font-medium">{formatCurrency(params.value)}</span>
      ),
    },
    {
      field: "paid_at",
      headerName: "Date",
      width: 125,
      renderCell: (params) => formatDate(params.value || params.row.create_at),
    },
    {
      field: "actions",
      headerName: "View",
      width: 75,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => setDetailPayment(params.row)}
          title="View payment"
        >
          <MdOutlineVisibility className="text-xl text-blue-500" />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="p-4">
      <PaymentSerch
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearch={setSearchQuery}
      />
      <p className="mb-4 text-sm text-gray-400">
        {loading
          ? "Loading payments..."
          : error
            ? `Error: ${error}`
            : `${filteredPayments.length} payment${filteredPayments.length !== 1 ? "s" : ""} found`}
      </p>
      <DataTable
        rows={filteredPayments}
        columns={columns}
        getRowId={(row) => row.id}
      />

      <Modal
        open={Boolean(detailPayment)}
        onClose={() => setDetailPayment(null)}
        title={
          detailPayment
            ? `Payment #${shortId(detailPayment.id)}`
            : "Payment Details"
        }
        widthClassName="max-w-2xl"
      >
        {detailPayment && (
          <div className="space-y-4 p-2 text-sm">
            <div className="flex items-center justify-between">
              <Chip
                label={detailPayment.status || "unknown"}
                color={STATUS_COLOR[detailPayment.status] || "default"}
                size="small"
                className="!capitalize"
              />
              <span className="text-gray-500">
                {formatDate(detailPayment.paid_at || detailPayment.create_at)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              <p>
                <span className="text-gray-400">Order ID</span>
                <br />
                {detailPayment.order_id || "—"}
                </p>
              <p>
                <span className="text-gray-400">Customer</span>
                <br />
                {detailPayment.user?.username ||
                  detailPayment.user?.email ||
                  detailPayment.user_id ||
                  "—"}
                </p>
              <p>
                <span className="text-gray-400">Method</span>
                <br />
                <span className="uppercase">{detailPayment.method || "—"}</span>
              </p>
              <p>
                <span className="text-gray-400">Amount paid</span>
                <br />
                {formatCurrency(detailPayment.amount_paid)}
                        </p>
              <p>
                <span className="text-gray-400">Amount refunded</span>
                <br />
                {formatCurrency(detailPayment.amount_refunded)}
              </p>
              <p>
                <span className="text-gray-400">Failure reason</span>
                <br />
                {detailPayment.failure_reason || "—"}
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-2 text-gray-400">Update payment status</p>
              <div className="relative flex h-9 w-fit items-center rounded-lg border border-gray-200 px-2">
                <select
                  value={detailPayment.status || "pending"}
                  disabled={updatingId === detailPayment.id}
                  onChange={(event) =>
                    handleStatusChange(detailPayment.id, event.target.value)
                  }
                  className="cursor-pointer appearance-none bg-transparent pr-5 capitalize outline-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <IoIosArrowDown className="pointer-events-none absolute right-2 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentList;

