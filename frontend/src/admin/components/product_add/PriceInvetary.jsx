import { memo, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdCurrencyRupee } from "react-icons/md";
import { getGstAPI } from "../../features/gst/gstThunk";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const PriceInvetary = memo(function PriceInvetary({
  productData,
  handleOnChange,
}) {
  const getGstId = (item) => {
    const id = item?.gst_id ?? item?.id ?? item?._id;
    return id == null ? "" : String(id);
  };

  const isGstActive = (item) => {
    const status = item?.is_active ?? item?.active;
    return status !== false && status !== 0;
  };

  const calculateProductPrice = (basePrice, discount) => {
    const base = Number(basePrice);
    const discountPercent = Number(discount) || 0;

    if (!base) return "";

    return String(base - (base * discountPercent) / 100);
  };

  const handleBasePriceChange = (e) => {
    handleOnChange(e);

    const basePrice = e.target.value;

    const price = calculateProductPrice(basePrice, productData?.discount);

    handleOnChange({
      target: {
        name: "Product_price",
        value: price,
      },
    });
  };

  const handleDiscountChange = (e) => {
    handleOnChange(e);

    const discount = e.target.value;

    const price = calculateProductPrice(productData?.Base_price, discount);

    handleOnChange({
      target: {
        name: "Product_price",
        value: price,
      },
    });
  };

  const handleProductPriceChange = (e) => {
    // Admin can manually change the calculated price
    handleOnChange(e);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGstAPI())
      .unwrap()
      .catch((loadError) => toast.error(loadError || "Failed to load GST"));
  }, [dispatch]);

  const { gst = [] } = useSelector((state) => state.gst ?? {});

  return (
    <div className="border border-gray-200 p-3 rounded-xl w-full">
      <h1 className="text-xl font-semibold py-4">Basic Details</h1>

      <div className="grid grid-cols-2 gap-2 py-2">
        {/* Base Price */}
        <div className="flex flex-col relative">
          <label htmlFor="BasePrice" className="font-semibold py-2">
            Base Price
          </label>

          <input
            type="number"
            name="Base_price"
            id="BasePrice"
            autoComplete="off"
            required
            min={0}
            placeholder="100"
            className="outline-none bg-blue-50 border px-7 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={handleBasePriceChange}
            value={productData?.Base_price ?? ""}
          />

          <MdCurrencyRupee className="absolute left-3 bottom-4" />
        </div>

        {/* Discount */}
        <div className="flex flex-col">
          <label htmlFor="pdiscount" className="font-semibold py-2">
            Discount (%)
          </label>

          <input
            type="number"
            name="discount"
            id="pdiscount"
            autoComplete="off"
            required
            min={0}
            max={100}
            placeholder="5"
            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={handleDiscountChange}
            value={productData?.discount ?? ""}
          />
        </div>

        {/* Product Price */}
        <div className="flex flex-col relative">
          <label htmlFor="ProductPrice" className="font-semibold py-2">
            Product Price
          </label>

          <input
            type="number"
            name="Product_price"
            id="ProductPrice"
            autoComplete="off"
            required
            min={0}
            placeholder="100"
            className="outline-none bg-blue-50 border px-7 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={handleProductPriceChange}
            value={productData?.Product_price ?? ""}
          />

          <MdCurrencyRupee className="absolute left-3 bottom-4" />
        </div>
        <div className="flex flex-col relative">
          <label htmlFor="gst" className="font-semibold py-2">
            GST
          </label>

          <select
            name="gst_id"
            id="gst"
            autoComplete="off"
            required={true}
            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 appearance-none"
            onChange={handleOnChange}
            value={productData?.gst_id}
          >
            <option value="option">Select Any One</option>
            {gst.filter(isGstActive).map((item) => {
              const gstId = getGstId(item);
              return (
                <option value={gstId} key={gstId}>
                  {item?.gst_rate ?? item?.rate ?? item?.percentage}%
                </option>
              );
            })}
          </select>
          <IoIosArrowDown className="absolute right-3 bottom-4 transition-transform duration-200 text-[15px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 py-2">
        {/* SKU */}
        <div className="flex flex-col relative">
          <label htmlFor="SKU" className="font-semibold py-2">
            SKU
          </label>

          <input
            type="text"
            name="sku"
            id="SKU"
            required
            autoComplete="off"
            placeholder="SKU-001"
            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200"
            onChange={handleOnChange}
            value={productData?.sku ?? ""}
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col relative">
          <label htmlFor="StockQuantity" className="font-semibold py-2">
            Stock Quantity
          </label>

          <input
            type="number"
            name="qty"
            id="StockQuantity"
            autoComplete="off"
            required
            min={0}
            placeholder="100"
            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={handleOnChange}
            value={productData?.qty ?? ""}
          />
        </div>
      </div>
    </div>
  );
});

export default PriceInvetary;
