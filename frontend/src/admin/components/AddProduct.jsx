import { lazy, memo, Suspense, useCallback, useState, useRef } from "react";
import { FiSave } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addProduct } from "../features/productAdd/productAddThunk";
import SkeletonAddProduct from "./common/SkeletonAddProduct";
import CircularProgress from "@mui/material/CircularProgress";
import AddAtribute from "./product_add/AddAtribute";
import { ToastContainer, toast } from "react-toastify";

const ProductInfo = lazy(() => import("./product_add/ProductInfo"));
const AddImage = lazy(() => import("./product_add/AddImage"));

const INITIAL_PRODUCT_DATA = {
  name: "",
  Category: "",
  Base_price: "",
  Product_price: "",
  sku: "",
  qty: "",
  discount: "",
  description: "",
  gender: "",
  status: "public",
  image: {
    image_url: "",
    image_name: "",
    is_primary: true,
    sort_order: 1,
  },
  images: [],
  attributes: [],
};

const isProductFormValid = (data) =>
  Boolean(
    data.name?.trim() &&
    data.Category &&
    data.Category !== "option" &&
    data.Base_price &&
    data.Product_price &&
    data.sku?.trim() &&
    data.qty &&
    data.description?.trim() &&
    data.gender &&
    data.gender !== "option" &&
    data.image?.image_name,
  );

const AddProduct = memo(function AddProduct() {
  const dispatch = useDispatch();
  const addImageRef = useRef(null);
  const atributeRef = useRef(null);
  const [productData, setProductData] = useState(INITIAL_PRODUCT_DATA);

  const handleSubmit = useCallback(
    async (status) => {
      if (!isProductFormValid(productData)) {
        toast.error("Please fill all required fields correctly.");
        return;
      }

      try {
        // Build FormData for submission
        const formData = new FormData();

        // Add product fields individually to FormData
        formData.append("name", productData.name || "");
        formData.append("Category", productData.Category || "");
        formData.append("Base_price", String(productData.Base_price || ""));
        formData.append(
          "Product_price",
          String(productData.Product_price || ""),
        );
        formData.append("sku", productData.sku || "");
        formData.append("qty", String(productData.qty || 0));
        formData.append("discount", String(productData.discount || 0));
        formData.append("description", productData.description || "");
        formData.append("gender", productData.gender || "");
        formData.append("status", status);

        // Add attributes if any
        if (productData.attributes && productData.attributes.length > 0) {
          formData.append("attributes", JSON.stringify(productData.attributes));
        }

        // Get and add images from AddImage component
        if (addImageRef.current?.getFormData) {
          const imageFormData = addImageRef.current.getFormData();
          for (const [key, value] of imageFormData.entries()) {
            formData.append(key, value);
          }
        }

        await dispatch(addProduct(formData)).unwrap();
        setProductData(INITIAL_PRODUCT_DATA);
        toast.success("Product saved successfully!");
      } catch (err) {
        toast.error(typeof err === "string" ? err : "Failed to save product.");
      }
    },

    [dispatch, productData],
  );

  const handlePublish = useCallback(() => {
    handleSubmit("public");
    addImageRef.current.reset();
    atributeRef.current.reset();
  }, [handleSubmit]);

  const handleSaveDraft = useCallback(() => {
    handleSubmit("private");
    addImageRef.current.reset();
    atributeRef.current.reset();
  }, [handleSubmit]);

  const handlePreventDefault = useCallback((e) => e.preventDefault(), []);

  return (
    <div className="px-4 py-3">
      <ToastContainer position="top-right" autoClose={1000} />

      <div className="flex justify-between max-[600px]:flex-col">
        <h1 className="text-lg p-2 font-medium">Add Product</h1>

        <div className="space-x-2 flex p-2 max-[600px]:justify-between">
          <button
            type="button"
            className="bg-green-700 hover:scale-101 w-40 h-15 cursor-pointer text-white font-semibold px-4 py-4 rounded-lg"
            onClick={handlePublish}
          >
            Public Product
          </button>

          <button
            type="button"
            className="border border-gray-200  w-40 h-15 hover:scale-101 cursor-pointer text-black font-semibold px-4 py-4 rounded-lg flex justify-center items-center gap-2"
            onClick={handleSaveDraft}
          >
            <FiSave />
            <span>Save to draft</span>
          </button>
        </div>
      </div>

      <form
        className="grid grid-cols-2 gap-10 max-[600px]:flex max-[600px]:flex-col"
        autoComplete="off"
        onSubmit={handlePreventDefault}
      >
        <Suspense fallback={<SkeletonAddProduct />}>
          <ProductInfo
            productData={productData}
            setProductData={setProductData}
          />
        </Suspense>

        <Suspense fallback={<SkeletonAddProduct />}>
          <AddImage
            ref={addImageRef}
            atributeRef={atributeRef}
            productData={productData}
            setProductData={setProductData}
          />
        </Suspense>
      </form>
    </div>
  );
});

export default AddProduct;
