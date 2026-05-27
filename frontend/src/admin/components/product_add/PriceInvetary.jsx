import { memo } from "react";

import { MdCurrencyRupee } from "react-icons/md";



const PriceInvetary = memo(function PriceInvetary({ productData, handleOnChange }) {

  return (

    <div className="border border-gray-200 p-3 rounded-xl w-full">

      <h1 className="text-xl font-semibold py-4">Basic Details</h1>

      <div className="grid grid-cols-2 gap-2 py-2">

        <div className="flex flex-col relative">

          <label htmlFor="BasePrice" className="font-semibold py-2">

            Base Price

          </label>

          <input

            type="number"

            name="Base_price"

            id="BasePrice"

            autoComplete="off"

            required={true}

            min={0}

            placeholder="100"

            className="outline-none bg-blue-50 border px-7 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

            onChange={handleOnChange}

            value={productData?.Base_price}

          />

          <MdCurrencyRupee className="absolute left-3 bottom-4" />

        </div>

        <div className="flex flex-col relative">

          <label htmlFor="ProductPrice" className="font-semibold py-2">

            Product Price

          </label>

          <input

            type="number"

            name="Product_price"

            id="ProductPrice"

            autoComplete="off"

            required={true}

            min={0}

            placeholder="100"

            className="outline-none bg-blue-50 border px-7 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

            onChange={handleOnChange}

            value={productData?.Product_price}

          />

          <MdCurrencyRupee className="absolute left-3 bottom-4" />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-2 py-2">

        <div className="flex flex-col relative">

          <label htmlFor="SKU" className="font-semibold py-2">

            SKU

          </label>

          <input

            type="text"

            name="sku"

            id="SKU"

            required={true}

            autoComplete="off"

            placeholder="SKU-001"

            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

            onChange={handleOnChange}

            value={productData?.sku}

          />

        </div>

        <div className="flex flex-col relative">

          <label htmlFor="StockQuantity" className="font-semibold py-2">

            Stock Quantity

          </label>

          <input

            type="number"

            name="qty"

            id="StockQuantity"

            autoComplete="off"

            required={true}

            min={0}

            placeholder="100"

            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

            onChange={handleOnChange}

            value={productData?.qty}

          />

        </div>

        <div className="flex flex-col">

          <label htmlFor="pdiscount" className="font-semibold py-2">

            Discount (%)

          </label>

          <input

            type="number"

            name="discount"

            id="pdiscount"

            autoComplete="off"

            required={true}

            placeholder="1"

            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

            onChange={handleOnChange}

            value={productData?.discount}

          />

        </div>

      </div>

    </div>

  );

});



export default PriceInvetary;

