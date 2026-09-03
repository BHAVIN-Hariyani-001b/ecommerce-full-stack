import React, { useEffect, useRef, useState } from "react";
import Category from "../category/Category";
import PageWapper from "../../../components/layout/PageWapper";
import { IoMdAddCircleOutline } from "react-icons/io";
import BrandList from "./BrandList";
import { CgCloseO } from "react-icons/cg";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewBrand,
  fetchBrand,
  updateBrand,
} from "../../features/Brand/brandThunk";
import { setIsUpdateBrand } from "../../features/Brand/brandSlice";

const instanceData = {
  name: "",
  image: null,
  imageUrl: null,
};

const BrandAdd = () => {
  const [brandData, setBrandData] = useState(instanceData);
  const data = useSelector((state) => state.brand.isUpdate);

  useEffect(() => {
    if (data?.id) {
      setBrandData({
        name: data?.name,
        image: data?.image,
        imageUrl: data?.image
          ? `../../../../public/image/Brand/${data?.image}`
          : "",
      });
    } else if (data === false) {
      setBrandData(instanceData);
    }
  }, [data]);

  console.log(brandData);

  const imageRef = useRef("");
  const dispatch = useDispatch();

  const isCheckData = (data) =>
    Boolean(
      data.name.trim() &&
      (data.image instanceof File ||
        (typeof data.image === "string" && data.image.trim())),
    );

  const handleSubmit = async () => {
    if (!isCheckData(brandData)) {
      toast.error("Please fill add required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", brandData.name);

      if (brandData.image instanceof File) {
        formData.append("image", brandData.image);
      } else if (brandData.image) {
        formData.append("existingImage", brandData.image);
      }

      if (data?.id) {
        console.log("click");
        await dispatch(updateBrand({ id: data?.id, formData })).unwrap();
        toast.success("Brand update successfully");
      } else {
        await dispatch(addNewBrand(formData)).unwrap();
        toast.success("Brand create successfully");
      }

      await dispatch(fetchBrand()).unwrap();

      setBrandData(instanceData);
    } catch (error) {
      toast.error(error || "Faild to process brand");
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnChangImage = (e) => {
    const file = e.target.files?.[0];
    console.log(file);
    console.log(e.target.files);
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setBrandData((prev) => ({
      ...prev,
      image: file,
      imageUrl: imageUrl,
    }));
  };

  const handleBrandImage = () => {
    imageRef.current.click();
  };

  const handleRemoveImage = () => {
    setBrandData((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.image);
      }
      return { ...prev, image: "", imageUrl: "" };
    });
    if (imageRef.current) imageRef.current.value = "";
  };

  return (
    <div>
      <PageWapper>
        <div className="grid grid-cols-2 place-content-center gap-2 max-[800px]:flex max-[800px]:flex-col p-3">
          <div className=" rounded-lg space-y-2 w-full border border-gray-200 px-4 py-7">
            <form
              className="space-y-5"
              autoComplete="off"
              onSubmit={(e) => e.preventDefault()}
            >
              <h1 className="font-semibold text-2xl">Create New Brand</h1>
              <div className="flex flex-col gap-2">
                <label htmlFor="brand" className="font-semibold">
                  Enter Brand Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="brand"
                  value={brandData.name}
                  onChange={handleOnChange}
                  className="outline-none border border-gray-200 rounded-lg p-2"
                />
              </div>

              <div className="space-y-2">
                <h1 className="font-semibold text-xl">Add Image </h1>
                <div className="grid grid-cols-2 place-items-center place-content-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={handleBrandImage}
                    className="border cursor-pointer border-gray-200 rounded-xl p-2 flex justify-center items-center flex-col w-full h-50 max-h-50 text-green-600"
                  >
                    <IoMdAddCircleOutline size={30} />
                    <div className="text-[16px]">Add Image</div>
                  </button>
                  {brandData.imageUrl && brandData.image ? (
                    <div className="border border-gray-200 rounded-xl p-2 flex justify-center items-center flex-col w-full h-50 max-h-50 relative">
                      <img
                        src={brandData.imageUrl}
                        alt={brandData.name}
                        className="h-full object-contain"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={handleRemoveImage}
                      >
                        <CgCloseO size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl p-2 flex justify-center items-center flex-col w-full h-50 max-h-50">
                      <span className="text-[14px] py-2 px-3 bg-gray-300 rounded-full">
                        Image Preview
                      </span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  name="Image"
                  id="brandImage"
                  ref={imageRef}
                  className="hidden"
                  onChange={handleOnChangImage}
                />
              </div>

              {!data?.id ? (
                <div className="text-center w-full h-14 text-white font-semibold bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-500 focus:scale-99">
                  <button
                    type="button"
                    className="w-full h-full cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Create Brand
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="text-center w-full h-14 text-white font-semibold bg-green-600 rounded-xl flex items-center justify-center  hover:bg-green-500 focus:scale-99">
                    <button
                      type="button"
                      className="w-full h-full cursor-pointer"
                      onClick={() => {
                        handleSubmit();
                        dispatch(setIsUpdateBrand(false));
                      }}
                    >
                      Update Brand
                    </button>
                  </div>
                  <div className="text-center w-full h-14 border border-gray-200 font-semibold rounded-xl flex items-center justify-center hover:text-white hover:bg-green-600 focus:scale-99">
                    <button
                      type="button"
                      className="w-full h-full cursor-pointer"
                      onClick={() => {
                        dispatch(setIsUpdateBrand(false));
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className=" rounded-lg p-3 border border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <h1 className="font-semibold text-2xl">Brand</h1>
              <div className="scrollbar-none overflow-y-auto h-100 shadow-inner p-2 space-y-2 rounded-lg">
                <BrandList />
              </div>
            </div>
          </div>
        </div>
      </PageWapper>
    </div>
  );
};

export default BrandAdd;
