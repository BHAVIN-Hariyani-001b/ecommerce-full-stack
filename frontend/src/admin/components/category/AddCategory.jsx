import { useCallback, useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchCategories } from "../../../features/category/categoryThunk";
import { IoIosArrowDown } from "react-icons/io";
import {
  NewaddCategory,
  updateCategory,
} from "../../features/category/categoryThunk";
import {
  setCategory,
  setIsUpdated,
} from "../../features/category/categorySlice";

const AddCategory = ({ data }) => {
  const catImageRef = useRef(null);
  const category = useSelector((state) => state.userCategory.category);
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    parentCategory: null,
    catImageUrl: "",
    catImage: "",
    status: false,
    order: null,
  });

  console.log(categoryData);

  useEffect(() => {
    if (data?.id) {
      setCategoryData({
        name: data.name ?? "",
        description: data.description ?? "",
        parentCategory: data.parentCategory ?? null,
        catImageUrl: data.image
          ? `../../../../public/image/category_img/${data.image}`
          : "",
        catImage: data.image ?? "",
        status: data.status === "ACTIVE" ? true : false,
        order: data.sort_order ?? null,
      });
    } else if (data === false) {
      setCategoryData({
        name: "",
        description: "",
        parentCategory: null,
        catImageUrl: "",
        catImage: "",
        status: false,
        order: null,
      });
    }
  }, [data]);

  const handleToggle = useCallback(() => {
    setCategoryData((prev) => ({ ...prev, status: !prev.status }));
  }, []);

  const isCheckData = (data) =>
    Boolean(
      data.name.trim() &&
      (data.catImage instanceof File ||
        (typeof data.catImage === "string" && data.catImage.trim())),
    );

  const handleSubmit = useCallback(async () => {
    if (!isCheckData(categoryData)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("description", categoryData.description);
      formData.append(
        "status",
        categoryData.status === true ? "ACTIVE" : "INACTIVE",
      );
      formData.append("parentCategory", categoryData.parentCategory);
      formData.append("sort_order", categoryData.order);

      // Only append file if it's a File object (new upload)
      if (categoryData.catImage instanceof File) {
        formData.append("catImage", categoryData.catImage);
      } else if (data?.id && categoryData.catImage) {
        formData.append("existingImage", categoryData.catImage);
      }

      let result;
      if (data?.id) {
        // Update existing category
        result = await dispatch(
          updateCategory({ id: data.id, formData }),
        ).unwrap();
      } else {
        // Add new category
        result = await dispatch(NewaddCategory(formData)).unwrap();
      }

      await dispatch(fetchCategories());

      setCategoryData({
        name: "",
        description: "",
        parentCategory: null,
        catImageUrl: "",
        catImage: "",
        status: false,
        order: null,
      });
      dispatch(setCategory(null));

      if (!result) {
        toast.error("Failed to process category");
        return;
      }
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error || "Failed to process category");
    }

    // Reset form
    setCategoryData({
      name: "",
      description: "",
      parentCategory: null,
      catImageUrl: "",
      catImage: "",
      status: false,
      order: null,
    });
    dispatch(setCategory(null));
  }, [categoryData, dispatch, data]);

  const handleCatImageOpen = useCallback(() => {
    catImageRef.current?.click();
  }, []);

  const handleOnChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setCategoryData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setCategoryData],
  );

  const handleOnChangeImage = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const imageUrl = URL.createObjectURL(file);
      setCategoryData((prev) => ({
        ...prev,
        catImage: file,
        catImageUrl: imageUrl,
      }));
    },
    [setCategoryData],
  );

  const removeCategoryImage = useCallback(() => {
    setCategoryData((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.catImage);
      }
      return { ...prev, catImage: "", catImageUrl: "" };
    });
    if (catImageRef.current) catImageRef.current.value = "";
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <form className="flex flex-col gap-3" autoComplete="off">
        <div className="flex flex-col gap-2">
          <label htmlFor="catName" className="font-semibold">
            Category Name
          </label>
          <input
            type="text"
            name="name"
            id="catName"
            placeholder="Fashion"
            value={categoryData.name}
            onChange={handleOnChange}
            className="outline-none border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="catOrder" className="font-semibold">
            Category Order
          </label>
          <input
            type="number"
            name="order"
            id="catOrder"
            placeholder="0"
            min={0}
            value={categoryData.order ?? ""}
            onChange={handleOnChange}
            className="outline-none border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col relative">
          <label className="font-semibold py-2">Parent Category</label>
          <select
            name="parentCategory"
            id="ProductParentCategory"
            required={true}
            autoComplete="off"
            className="outline-none bg-blue-50 border px-3 py-3 rounded-lg border-gray-200 appearance-none"
            onChange={handleOnChange}
            value={categoryData?.parentCategory ?? "option"}
          >
            {(() => {
              const filtered = category.filter(
                (cat) => cat?.id !== 1 && !cat?.parent_id,
              );

              return filtered.length > 0 ? (
                <>
                  <option value="option">Select Any One</option>
                  {filtered.map((cat) => (
                    <option value={cat?.name} key={cat?.id}>
                      {cat?.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="option" selected={true}>
                  Not Categor y Found
                </option>
              );
            })()}
          </select>

          <IoIosArrowDown className="absolute right-3 bottom-4 transition-transform duration-200 text-[15px]" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="CatDes" className="font-semibold">
            Description
          </label>
          <textarea
            type="text"
            name="description"
            id="CatDes"
            className="outline-none border border-gray-300 p-2 rounded-lg resize-none h-30"
            placeholder="..."
            value={categoryData.description}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex justify-between">
          <label htmlFor="Status" className="font-semibold">
            Visible Status
          </label>
          <div
            id="Status"
            name="status"
            aria-checked={categoryData.status}
            aria-labelledby="status-label"
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={(e) =>
              (e.key === " " || e.key === "Enter") && handleToggle()
            }
            role="checkbox"
            aria-checked={categoryData.status}
            className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${
              categoryData.status ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow transition-transform duration-300 ${
                categoryData.status ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="border border-gray-300 cursor-pointer rounded-lg h-50 flex flex-col justify-center items-center max-[600px]:max-h-40 max-[600px]:text-[14px]"
            onClick={handleCatImageOpen}
          >
            <IoCloudUploadOutline size={40} />
            <span className="font-semibold">Click to Upload</span>
          </button>
          <div className="flex items-center p-4 justify-center border border-gray-300 rounded-lg h-50 object-contain max-[600px]:max-h-40">
            {!categoryData.catImage && !categoryData.catImageUrl ? (
              <span className="bg-gray-300 px-2 py-1 rounded-3xl text-[12px] text-center">
                image preview
              </span>
            ) : (
              <div className="border rounded-2xl border-gray-200 h-full flex items-center justify-center p-2 relative">
                <img
                  src={categoryData.catImageUrl}
                  alt={categoryData.name}
                  className="h-full object-contain border border-gray-300 rounded-2xl border-dotted"
                />
                <button
                  type="button"
                  onClick={removeCategoryImage}
                  className="top-1 right-1 absolute cursor-pointer"
                >
                  <RxCrossCircled className="text-2xl text-black" />
                </button>
              </div>
            )}
          </div>
          <input
            ref={catImageRef}
            accept="image/*"
            type="file"
            name="catImage"
            id="categoryImage"
            className="hidden"
            onChange={handleOnChangeImage}
          />
        </div>
        {!data?.id ? (
          <div className="text-center w-full h-14 text-white font-semibold bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-400 focus:scale-99">
            <button
              type="button"
              className="w-full h-full cursor-pointer"
              onClick={handleSubmit}
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="text-center w-full h-14 text-white font-semibold bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-400 focus:scale-99">
              <button
                type="button"
                className="w-full h-full cursor-pointer"
                onClick={() => {
                  handleSubmit();
                  dispatch(setIsUpdated(false));
                }}
              >
                Update Category
              </button>
            </div>
            <div className="text-center w-full h-14 border border-gray-200 font-semibold rounded-xl flex items-center justify-center hover:text-white hover:bg-blue-400 focus:scale-99">
              <button
                type="button"
                className="w-full h-full cursor-pointer"
                onClick={() => {
                  dispatch(setIsUpdated(false));
                }}
              >
                Cancel Category
              </button>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default AddCategory;
