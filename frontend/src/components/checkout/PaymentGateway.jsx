import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import BillDetails from "../cart/BillDetails";
import { TbCashBanknote } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createOrderAPI } from "../../features/orders/orderThunk";
import { fetchCartItem } from "../../features/card/cardThunk";
import { loadRazorpay } from "../../util/loadRazorpay";
import api from "../../middleware/index";
import { getErrorMessage } from "../../util/getErrorMessage";

const PaymentGateway = ({ setAction, setOrderResult }) => {
  const { finalPrice } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const UserAddress = useSelector((state) => state.address?.PrimaryAddress);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const dispatch = useDispatch();
  const [isPaying, setIsPaying] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const paymentMethodItem = [
    {
      lable: "UPI",
      detail: "GPay, PhonePe, BHIM",
      key: "upi",
      src: <img src="/image/UPI.png" alt="upi" className="w-10" />,
    },
    {
      lable: "Card",
      key: "card",
      detail: "Visa, Mastercard",
      src: (
        <div className="flex gap-2">
          <img
            src="/image/visa.png"
            alt="visa"
            className="w-6 object-contain"
          />
          <img
            src="/image/mastercard.png"
            alt="mastercard"
            className="w-6 object-contain"
          />
          <img
            src="/image/rupay.png"
            alt="rupay"
            className="w-6 object-contain"
          />
        </div>
      ),
    },
    {
      lable: "Cash On Delivery",
      key: "cod",
      src: <TbCashBanknote size={25} className="text-gray-600" />,
    },
  ];

  const handleOnlinePayment = async (orderId) => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error(
          "Razorpay Checkout could not load. Check your connection.",
        );
      }

      const { data: paymentOrder } = await api.post("/create/order", {
        method: paymentMethod,
        order_id: orderId,
        user_id: user.id,
      });

      const razorpayOrderId = paymentOrder.razorpay_order_id;
      if (!razorpayOrderId || !paymentOrder.key_id) {
        throw new Error("Payment order was incomplete. Please try again.");
      }

      // Show only the method the user selected (UPI or Card)
      const methodLabel = paymentMethod === "upi" ? "UPI" : "Card";
      const methodConfig = {
        display: {
          blocks: {
            selected_method: {
              name: `Pay via ${methodLabel}`,
              instruments: [{ method: paymentMethod }],
            },
          },
          sequence: ["block.selected_method"],
          preferences: {
            show_default_blocks: false,
          },
        },
      };

      const razorpay = new window.Razorpay({
        key: paymentOrder.key_id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "Venture.com",
        description: "Order payment",
        order_id: razorpayOrderId,
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
        },
        notes: { preferred_method: paymentMethod },
        config: methodConfig,
        handler: async (response) => {
          try {
            const verificationPayload = {
              razorpay_order_id:
                response.razorpay_order_id || razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
            };

            const missingFields = Object.entries(verificationPayload)
              .filter(([, value]) => !value)
              .map(([field]) => field);

            if (missingFields.length > 0) {
              throw new Error(
                `Missing payment verification fields: ${missingFields.join(", ")}.`,
              );
            }

            const { data: verification } = await api.post(
              "/payment/verify-payment",
              verificationPayload,
            );

            if (!verification.verified || !verification.success) {
              const message =
                verification.message ||
                verification.error ||
                "Payment verification failed.";
              setStatus({ type: "error", message });
              toast.error(message);
              return;
            }

            setStatus({
              type: "success",
              message: "Payment verified. Your order is confirmed.",
            });
            toast.success("Payment successful");
            setAction("confirmation");
          } catch (error) {
            const message = getErrorMessage(error);
            setStatus({
              type: "error",
              message: `${message} Contact support if amount was deducted.`,
            });
            toast.error(message);
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            setStatus({
              type: "error",
              message: "Payment cancelled. You can try again.",
            });
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        const message =
          response.error?.description ||
          response.error?.reason ||
          "Payment failed.";
        setStatus({ type: "error", message });
        toast.error(message);
        setIsPaying(false);
      });

      razorpay.open();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Razorpay ERROR:", error);
      setStatus({ type: "error", message });
      toast.error(message);
      setIsPaying(false);
    }
  };

  const handleCheckOut = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!UserAddress?.id) {
      toast.error("Please select an address");
      return;
    }

    if (!user?.id) {
      toast.error("Please login to continue");
      return;
    }

    setIsPaying(true);
    setStatus({ type: "", message: "" });

    try {
      const order = await dispatch(
        createOrderAPI({
          user_id: user.id,
          address_id: UserAddress.id,
          payment_method: paymentMethod,
        }),
      ).unwrap();

      const orderId = order?.data?.id;

      if (!orderId) {
        throw new Error("Order ID was not returned by the server");
      }

      setOrderResult?.({
        ...order,
        payment_method: paymentMethod,
      });

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully");
        setAction("confirmation");
        setIsPaying(false);
        return;
      }

      await dispatch(fetchCartItem(user.id));
      // Keep isPaying true until Razorpay modal closes / payment finishes
      await handleOnlinePayment(orderId);
    } catch (error) {
      console.error("Checkout error:", error);
      const message = getErrorMessage(error);
      setStatus({ type: "error", message });
      toast.error(message);
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-scroll h-130 scrollbar-none grid grid-cols-2 gap-3 p-2 max-[900px]:flex max-[900px]:flex-col max-[900px]:overflow-auto">
        <div className="p-4 bg-gray-100 rounded-2xl space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div>
              <button
                className="hover:bg-gray-300 duration-400 group bg-white cursor-pointer gap-1 flex items-center justify-center px-2 py-1 rounded-full border border-gray-200"
                onClick={() => setAction("order")}
              >
                <IoIosArrowBack
                  size={16}
                  className="group-hover:-translate-x-1 duration-500"
                />
                <span>Back</span>
              </button>
            </div>
            <span className="text-xl">Select Payment Option</span>
          </div>
          {status.message && (
            <p
              className={`px-2 text-sm ${
                status.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {status.message}
            </p>
          )}
          <div className="flex flex-col justify-center gap-3">
            {paymentMethodItem.map((item) => (
              <div
                key={item.key}
                onClick={() => !isPaying && setPaymentMethod(item.key)}
                className={`flex items-center justify-between gap-2 rounded-full border hover:border-blue-300 hover:shadow-md transition-colors shadow-lg duration-300 bg-white p-5 cursor-pointer ${
                  paymentMethod === item.key
                    ? "border-blue-400 outline-2 outline-blue-100/50"
                    : "border-gray-300"
                } ${isPaying ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span>{item.lable}</span>

                  {item?.detail && (
                    <span className="text-[12px] text-gray-400">
                      {item.detail}
                    </span>
                  )}
                </div>

                {item.src}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-4 space-y-2">
          <p className="text-xl p-2">Price Details</p>
          <BillDetails />
          <div className="flex w-full h-20 p-3">
            <div className="flex p-4 justify-between items-center w-full bg-white rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
              <p>
                <span className="text-gray-800">Order total</span>{" "}
                <span className="font-bold">&#8377;{finalPrice}</span>{" "}
              </p>
              <button
                className="bg-green-600 w-30 rounded-full text-white h-10 cursor-pointer disabled:opacity-50"
                onClick={handleCheckOut}
                disabled={isPaying}
              >
                {isPaying ? "Processing..." : "CheckOut"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
