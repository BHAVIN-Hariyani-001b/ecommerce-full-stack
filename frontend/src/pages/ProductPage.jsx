import { useEffect, useState } from "react";
import PageWapper from "../components/layout/PageWapper";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../admin/components/common/Container";
import { useDispatch, useSelector } from "react-redux";
import { productPageAPI } from "../features/productPage/ProductPageThunk";
import { IoIosArrowBack } from "react-icons/io";
import ProductReview from "../components/product/ProductReview";
import ProductService from "../components/product/ProductService";
import ProductAbout from "../components/product/ProductAbout";
import ProductDetails from "../components/product/ProductDetails";
import ProductPageImage from "../components/product/ProductPageImage";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product);
  console.log(product);

  const navigate = useNavigate();

  const [option, setOption] = useState(true);
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

  // console.log(productAttributes);

  useEffect(() => {
    filterData();
  }, [product]);

  useEffect(() => {
    (async () => {
      await dispatch(productPageAPI(id));
    })();
  }, [id, dispatch]);

  const handleOnClickToBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div>
      <PageWapper className={"space-y-3"}>
        <button
          onClick={handleOnClickToBack}
          className="fixed left-5 top-20 min-[600px]:hidden z-10 border border-gray-200 rounded-full p-1 bg-white shadow-md cursor-pointer"
        >
          <IoIosArrowBack size={24} />
        </button>
        <div className="grid grid-cols-2 max-[700px]:flex max-[700px]:justify-center max-[700px]:items-center max-[700px]:flex-wrap h-full my-5 w-full gap-5 p-2">
          <ProductPageImage />

          <ProductDetails productAttributes={productAttributes} />
        </div>

        <ProductService />

        <div className="p-2">
          <div className="p-2 border border-gray-200 rounded-2xl">
            <div className="p-2 text-[14px]">
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={() => setOption(true)}
                  className={`cursor-pointer border bg-gray-200 px-4 py-1 rounded-full hover:bg-gray-300 ${option ? " border-blue-500" : "border-gray-300"}`}
                >
                  About
                </button>
                <button
                  type="button"
                  onClick={() => setOption(false)}
                  className={`cursor-pointer border bg-gray-200 px-4 py-1 rounded-full hover:bg-gray-300 ${!option ? " border-blue-500" : "border-gray-300"}`}
                >
                  Review
                </button>
              </div>
            </div>
            <div className="w-full border border-gray-200 p-5 rounded-2xl">
              {option ? <ProductAbout /> : <ProductReview productId={id} />}
            </div>
          </div>
        </div>
      </PageWapper>
    </div>
  );
};

export default ProductPage;
