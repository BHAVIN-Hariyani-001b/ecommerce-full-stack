import { IoCheckmarkCircle } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { RiFileList2Fill } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import { useSelector } from "react-redux";

const PAYMENT_LABELS = {
  upi: "UPI",
  card: "Card",
  cod: "Cash on Delivery",
};

const OrderConfirmation = ({ orderResult, setCheckOut }) => {
  const user = useSelector((state) => state.auth.user);
  const fallbackAddress = useSelector(
    (state) => state.address?.PrimaryAddress,
  );

  const order = orderResult?.data || orderResult || null;
  const paymentMethod =
    orderResult?.payment_method || order?.payment_method || "cod";
  const address = order?.address || fallbackAddress;
  const items = order?.order_item || [];

  const capitalized = (value = "") =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

  const formatPin = (pin = "") => {
    const digits = String(pin);
    if (digits.length < 6) return digits;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)}`;
  };

  const formatPhone = (phone = "") => {
    const digits = String(phone);
    if (digits.length < 10) return digits;
    return `${digits.slice(0, 3)} ${digits.slice(3, 8)} ${digits.slice(8)}`;
  };

  const shortOrderId = order?.id
    ? `#${String(order.id).slice(0, 8).toUpperCase()}`
    : "#ORDER";

  const handleContinueShopping = () => {
    setCheckOut?.(false);
  };

  return (
    <div className="overflow-scroll h-130 scrollbar-none grid grid-cols-2 gap-3 p-2 max-[900px]:flex max-[900px]:flex-col max-[900px]:overflow-auto">
      <div className="space-y-3 w-full bg-gray-100 p-4 rounded-2xl min-[900px]:overflow-auto scrollbar-none">
        <div className="bg-white rounded-xl shadow-lg p-5 space-y-4">
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <IoCheckmarkCircle className="text-green-600" size={56} />
            <h1 className="text-xl font-semibold text-gray-800">
              Order placed successfully
            </h1>
            <p className="text-sm text-gray-500">
              Thanks{user?.username ? `, ${capitalized(user.username)}` : ""}.
              We&apos;ve received your order.
            </p>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              Order {shortOrderId}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <MdOutlinePayments className="text-gray-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm text-gray-500">Payment method</p>
                <p className="font-medium text-gray-800">
                  {PAYMENT_LABELS[paymentMethod] || paymentMethod}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RiFileList2Fill className="text-gray-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm text-gray-500">Order status</p>
                <p className="font-medium text-green-700 capitalize">
                  {order?.status || "confirmed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-lg">
            <TbTruckDelivery size={20} className="text-gray-700" />
            <h2 className="font-semibold text-gray-800">Delivery Address</h2>
          </div>

          {address ? (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="space-x-2">
                <span className="font-semibold">
                  {capitalized(address?.userName)}
                </span>
                {address?.location_type && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                    {String(address.location_type).toUpperCase()}
                  </span>
                )}
              </div>
              <p>
                {`${address?.street_area || ""}, ${address?.city || ""}, ${address?.state || ""}, ${formatPin(address?.pin_code)}`}
              </p>
              {user?.phone && <p>{formatPhone(user.phone)}</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Delivery address will appear in your orders.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 w-full bg-gray-100 p-4 rounded-2xl min-[900px]:overflow-auto scrollbar-none">
        <h2 className="text-[18px] font-semibold">Order Summary</h2>

        <div className="space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-md border border-gray-200 bg-white p-2.5 shadow-sm"
              >
                <div className="w-20 h-20 shrink-0">
                  <img
                    src={`/image/product_img/${item?.product?.image?.image_name}`}
                    alt={item?.product?.name || "Product"}
                    className="h-full w-full rounded-md border border-gray-100 object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                      {item?.product?.name}
                    </p>
                    <span className="shrink-0 rounded bg-green-500 px-2 py-1 text-[11px] font-medium text-white">
                      Qty {item?.qty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {item?.product?.discount != null && (
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                        {item.product.discount}% OFF
                      </span>
                    )}
                    {item?.product?.BPrice != null && (
                      <span className="text-xs text-gray-400 line-through">
                        &#8377;{item.product.BPrice}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-gray-800">
                      &#8377;
                      {item?.price_at_purchase || item?.product?.PPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-4 text-sm text-gray-500">
              Your order items are confirmed. You can track them anytime from
              your profile.
            </div>
          )}
        </div>

        <div className="bg-white mx-0 p-3 rounded-xl shadow-xl">
          <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-2">
            <span className="font-medium text-gray-800">Order total</span>
            <span className="font-bold text-gray-900">
              &#8377;{order?.total_amount ?? "—"}
            </span>
          </div>
        </div>

        <div className="flex w-full p-1">
          <div className="flex p-4 justify-between items-center w-full bg-white rounded-xl shadow-lg">
            <p className="text-sm text-gray-600 pr-3">
              We&apos;ll notify you when your order ships.
            </p>
            <button
              type="button"
              className="bg-green-600 shrink-0 px-5 rounded-full text-white h-10 cursor-pointer hover:bg-green-700 transition-colors"
              onClick={handleContinueShopping}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
