import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import { FiSave } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  UpdateProductAPI,
} from "../features/productAdd/productAddThunk";
import SkeletonAddProduct from "./common/SkeletonAddProduct";
import AddAtribute from "./product_add/AddAtribute";
import { toast } from "react-toastify";
import { setIsUpdatedProduct } from "../features/productAdd/productAddSlice";

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
  image: { image_url: "", image_name: "", is_primary: true, sort_order: 1 },
  images: [],
  attributes: [],
  removeImg: [],
  removeAttributes: [],
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

const AddProduct = memo(function AddProduct({ setActivePage }) {
  const dispatch = useDispatch();
  const addImageRef = useRef(null);
  const atributeRef = useRef(null);
  const [productData, setProductData] = useState(INITIAL_PRODUCT_DATA);

  const isUpdateProduct = useSelector(
    (state) => state.productAdd.isUpdateProduct,
  );

  useEffect(() => {
    if (isUpdateProduct?.id) {
      setProductData({
        id: isUpdateProduct?.id,
        name: isUpdateProduct?.name ?? "",
        Category: isUpdateProduct?.category ?? "",
        Base_price: isUpdateProduct?.BPrice ?? "",
        Product_price: isUpdateProduct?.PPrice ?? "",
        sku: isUpdateProduct?.sku ?? "",
        qty: isUpdateProduct?.qty ?? "",
        discount: isUpdateProduct?.discount ?? "",
        description: isUpdateProduct?.description ?? "",
        gender: isUpdateProduct?.gender ?? "",
        status: isUpdateProduct?.status ?? "public",
        image: {
          image_url: `../../../public/image/product_img/${isUpdateProduct?.image?.image_name}`,
          image_name: isUpdateProduct?.image?.image_name,
        },
        images: (isUpdateProduct?.images ?? []).map((img) => ({
          id: img?.id,
          image_name: img.image_name,
          image_url: `../../../public/image/product_img/${img.image_name}`,
        })),
        attributes: (isUpdateProduct?.attributes ?? []).map((attr) => ({
          id: attr.id,
          type: attr.type,
          value: attr.value,
        })),
        removeImg: [],
        removeAttributes: [],
      });
    } else {
      setProductData(INITIAL_PRODUCT_DATA);
      addImageRef.current?.reset();
      atributeRef.current?.reset();
    }
  }, [isUpdateProduct?.id]);

  const resetForm = useCallback(() => {
    setProductData(INITIAL_PRODUCT_DATA);
    addImageRef.current?.reset();
    atributeRef.current?.reset();
  }, []);

  const handleSubmit = useCallback(
    async (status) => {
      if (!isProductFormValid(productData)) {
        toast.error("Please fill all required fields correctly.");
        return false;
      }

      try {
        const formData = new FormData();
        formData.append("name", productData.name || "");
        formData.append("category", productData.Category || "");
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

        if (productData.removeImg?.length > 0) {
          productData.removeImg.forEach((id) => {
            formData.append("removeImg[]", id);
          });
        }

        if (productData.attributes?.length > 0) {
          productData.attributes.forEach((attr, idx) => {
            formData.append(`attributes[${idx}]`, JSON.stringify(attr));
          });
        }

        if (addImageRef.current?.getFormData) {
          const imageFormData = addImageRef.current.getFormData();
          for (const [key, value] of imageFormData.entries()) {
            formData.append(key, value);
          }
        }

        (productData.removeAttributes ?? []).forEach((id) => {
          formData.append("removeAttributes[]", id);
        });

        const isUpdating = Boolean(isUpdateProduct?.id);

        let result = null;
        if (isUpdating) {
          result = await dispatch(
            UpdateProductAPI({ id: isUpdateProduct?.id, formData }),
          ).unwrap();
        } else {
          result = await dispatch(addProduct(formData)).unwrap();
        }

        if (!result) {
          toast.error(
            isUpdating ? "Failed to update product." : "Failed to add product.",
          );
          return false;
        }

        toast.success(
          isUpdating
            ? "Product updated successfully!"
            : "Product added successfully!",
        );

        if (isUpdating) {
          await dispatch(setIsUpdatedProduct(false));
        }

        setTimeout(() => {
          resetForm();
          setActivePage(isUpdating ? "products" : "Add Product");
        }, 1500);

        return true;
      } catch (err) {
        console.error("Submit error:", err);
        toast.error(typeof err === "string" ? err : "Failed to save product.");
        return false;
      }
    },
    [dispatch, productData, isUpdateProduct, setActivePage, resetForm],
  );

  const handlePublish = useCallback(async () => {
    const success = await handleSubmit("public");
    if (success) resetForm();
  }, [handleSubmit, resetForm]);

  const handleSaveDraft = useCallback(async () => {
    const success = await handleSubmit("private");
    if (success) resetForm();
  }, [handleSubmit, resetForm]);

  const handleCancel = useCallback(() => {
    resetForm();
    dispatch(setIsUpdatedProduct(false));
    setActivePage("products");
  }, [resetForm, dispatch, setActivePage]);

  const handlePreventDefault = useCallback((e) => e.preventDefault(), []);

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between max-[600px]:flex-col">
        <h1 className="text-lg p-2 font-medium">
          {isUpdateProduct?.id ? "Edit Product" : "Add Product"}
        </h1>

        <div className="space-x-2 text-[14px] flex p-2 max-[600px]:justify-between">
          {isUpdateProduct?.id ? (
            <>
              <button
                type="button"
                className="bg-green-700 hover:scale-101 w-40 h-15 cursor-pointer text-white font-semibold px-4 py-4 rounded-lg"
                onClick={handlePublish}
              >
                Update Product
              </button>
              <button
                type="button"
                className="border border-gray-200 w-40 h-15 hover:scale-101 cursor-pointer text-black font-semibold px-4 py-4 rounded-lg flex justify-center items-center gap-2"
                onClick={handleCancel}
              >
                <FiSave />
                <span>Cancel Update</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="bg-green-700 hover:scale-101 w-40 h-15 cursor-pointer text-white font-semibold px-4 py-4 rounded-lg"
                onClick={handlePublish}
              >
                Public Product
              </button>
              <button
                type="button"
                className="border border-gray-200 w-40 h-15 hover:scale-101 cursor-pointer text-black font-semibold px-4 py-4 rounded-lg flex justify-center items-center gap-2"
                onClick={handleSaveDraft}
              >
                <FiSave />
                <span>Save to draft</span>
              </button>
            </>
          )}
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
            key={isUpdateProduct?.id ?? "new"}
            imageRef={addImageRef}
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
