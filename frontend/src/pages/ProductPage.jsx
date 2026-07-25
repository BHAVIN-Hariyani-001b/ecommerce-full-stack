import React, { useEffect, useState } from "react";
import PageWapper from "../components/layout/PageWapper";
import { useParams } from "react-router-dom";
import Container from "../admin/components/common/Container";
import { useDispatch, useSelector } from "react-redux";
import { productPageAPI } from "../features/productPage/ProductPageThunk";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { TbReplace, TbTruckDelivery } from "react-icons/tb";
import { LuBadgeIndianRupee } from "react-icons/lu";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product);
  console.log(product);
  const [productAttributes, setProductAttributes] = useState({
    Color: [],
    Size: [],
    Text: [],
    Number: [],
  });

  const filterData = () => {
    const grouped = { Color: [], Size: [], Text: [], Number: [] };

    (product?.attributes ?? []).forEach((item) => {
      if (grouped[item?.name]) {
        grouped[item.name].push(item);
      } else {
        grouped.Text.push(item); // fallback bucket for unknown types
      }
    });

    setProductAttributes(grouped);
  };

  console.log(productAttributes);

  useEffect(() => {
    filterData();
  }, [product]);

  useEffect(() => {
    (async () => {
      await dispatch(productPageAPI(id));
    })();
  }, [id, dispatch]);

  return (
    <div>
      <PageWapper className={"space-y-3"}>
        <div className="grid grid-cols-2 max-[700px]:flex max-[700px]:flex-wrap h-full my-5 w-full gap-5 p-2">
          <div className="sticky top-25 max-[800px]:static  border border-gray-200 h-fit w-full rounded-2xl p-5 space-y-4">
            {/* this is product image show */}

            <div className="flex items-center justify-center">
              <img
                src={`../../public/image/product_img/${product?.image?.image_name}`}
                alt={product?.name}
                className="object-contain w-full rounded-2xl"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto w-full max-w-fit scrollbar-none">
              {(product?.images ?? []).map((item) => (
                <div
                  key={item?.id}
                  className="w-20 h-20 shrink-0 border m-1 border-gray-200 rounded-lg cursor-pointer"
                >
                  <img
                    src={`../../public/image/product_img/${item?.image_name}`}
                    className="object-cover object-center w-20 h-20 rounded-lg p-1"
                    alt={product?.name}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 h-full w-full rounded-2xl p-5">
            {/* this is the product all info */}
            <div className="space-y-5">
              <div className="line-clamp-4 text-2xl">{product?.name}</div>
              <div className="flex gap-1 items-center">
                <span className="text-[12px]">2.5%</span>
                <Stack spacing={1}>
                  <Rating
                    name="half-rating-read"
                    defaultValue={2.5}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                </Stack>
              </div>
              <div className="">
                <div className="space-x-2 flex">
                  <div className="text-3xl flex gap-2 items-center">
                    <span className="text-xl">&#8377;</span> {product?.PPrice}
                  </div>
                  <div className="text-green-700 text-[16px] pb-0.5 items-end font-bold flex gap-1">
                    <span>{product?.discount}%</span>
                    <span>off</span>
                  </div>
                </div>
                <div className="text-gray-400 pl-1 space-x-2">
                  <span className="line-through">
                    &#8377; {product?.BPrice}
                  </span>
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
                                className="w-10 h-10 flex shadow-2xl rounded-md border border-gray-200 justify-center items-center"
                                style={
                                  name === "Color"
                                    ? { backgroundColor: item?.value }
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
                    className="bg-blue-500 text-white  py-3 rounded-xl cursor-pointer"
                  >
                    Buy Product
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 text-white  py-3 rounded-xl cursor-pointer"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="p-2 border border-gray-200 rounded-2xl flex justify-around">
            <div className="w-40 p-3 rounded-2xl grid grid-rows-2 place-items-center place-content-center">
              <TbReplace size={50} />
              <div className="text-center">
                <p>10 days Service Centre Replacement</p>
              </div>
            </div>
            <div className="w-40 p-3 rounded-2xl grid grid-rows-2 place-items-center place-content-center">
              <TbTruckDelivery size={50} />
              <div className="text-center">
                <p>Free Delivery</p>
              </div>
            </div>
            <div className="w-40 p-3 rounded-2xl grid grid-rows-2 place-items-center place-content-center">
              <LuBadgeIndianRupee size={50} />
              <div className="text-center">
                <p>Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <div>
            <div className="w-full border border-gray-200 p-5 rounded-2xl">
              <h1 className="text-2xl font-semibold">About This Item</h1>
              <div
                className="py-2"
                dangerouslySetInnerHTML={{ __html: product.aboutItem }}
              />
            </div>
          </div>
        </div>
      </PageWapper>
    </div>
  );
};

export default ProductPage;
