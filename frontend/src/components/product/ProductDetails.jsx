import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const ProductDetails = ({ productAttributes }) => {

  const product = useSelector((state) => state.product.product);
  return (
    <>
      <div className="border border-gray-200 h-full w-full rounded-2xl p-5">
        {/* this is the product all info */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center">
              <div className="">
                {product?.brand && (
                  <div className="text-blue-700 font-normal text-[15px]">
                    {product?.brand ? product?.brand.toUpperCase() : "No Brand"}
                  </div>
                )}
              </div>
              <div className="flex gap-1 items-center bg-green-200 text-green-700 px-2 py-1 rounded-full">
                <span className="text-[12px]">2.5%</span>
                <FaStar size={15} className="rotate-10" />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-gray-400 text-[14px]">
                {product?.category ? product?.category : "No Category"}
              </span>
            </div>
          </div>
          <div className="line-clamp-4 text-2xl">{product?.name}</div>
          <div className="">
            <div className="space-x-2 flex">
              <div className="text-3xl flex gap-2 items-center">
                <span className="text-xl font-medium">&#8377;</span>{" "}
                {product?.PPrice}
              </div>
              <div className="text-white text-[14px] pb-0.5 items-end font-bold flex gap-1">
                <div className="bg-green-700 py-0.5 px-1 rounded">
                  <span>{product?.discount}% </span>
                  <span>OFF</span>
                </div>
              </div>
            </div>
            <div className="text-gray-400 pl-1 space-x-2">
              <span className="line-through">&#8377; {product?.BPrice}</span>
              <span>MRP (include with text)</span>
            </div>
          </div>
          <div>
            <div className="flex gap-10 w-full flex-wrap">
              {Object.entries(productAttributes).map(
                ([name, items]) =>
                  items.length > 0 && (
                    <div key={name} className="flex flex-col gap-2">
                      <span className="text-sm font-medium">{name}</span>
                      <div className="flex gap-2">
                        {items.map((item) => (
                          <span
                            key={item.product_id + item.value}
                            className="w-10 h-10 flex shadow-2xl rounded-md border border-gray-200 justify-center items-center cursor-pointer"
                            style={
                              name === "Color"
                                ? {
                                    backgroundColor: item?.value,
                                    borderRadius: "50%",
                                  }
                                : undefined
                            }
                          >
                            {name !== "Color" && item?.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
          <div>
            <div
              className="p-1 text-wrap "
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="bg-blue-600 text-white  py-3 rounded-xl cursor-pointer"
              >
                Buy Product
              </button>
              <button
                type="button"
                className="border border-gray-300 text-black  py-3 rounded-xl cursor-pointer"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
