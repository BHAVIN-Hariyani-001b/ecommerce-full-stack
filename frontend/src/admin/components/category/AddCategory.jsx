import { useCallback, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { NewaddCategory } from "../../features/category/categoryThunk";

const AddCategory = () => {
  const catImageRef = useRef(null);
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    catImageUrl: "",
    catImage: "",
    status: false,
  });

  const handleToggle = useCallback(() => {
    setCategoryData((prev) => ({ ...prev, status: !prev.status }));
  }, []);

  const isCheckData = (data) => Boolean(data.name.trim() && data.catImage);

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
      formData.append("catImage", categoryData.catImage);
      formData.append("catImageUrl", catImageRef.current);

      const result = await dispatch(NewaddCategory(formData)).unwrap();
      if (!result) {
        toast.error("Failed to add category");
        return;
      }

      toast.success("Category created successfully!");
    } catch (error) {
      console.log(error);
    }

    setCategoryData({
      name: "",
      description: "",
      catImageUrl: "",
      catImage: "",
      status: false,
    });
  }, [categoryData, dispatch]);

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

  console.log(categoryData);

  return (
    <>
      <form className="flex flex-col gap-3" autoComplete="off">
        <ToastContainer position="top-right" autoClose={1000} />
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
          <label htmlFor="CatDes" className="font-semibold">
            {" "}
            Description{" "}
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
            {!categoryData.catImage ? (
              <span className="bg-gray-300 px-2 py-1 rounded-3xl text-[12px]">
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
        <div className="text-center w-full h-14 text-white font-semibold cursor-pointer bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-400 focus:scale-99">
          <button
            type="button"
            className="w-full h-full"
            onClick={handleSubmit}
          >
            Create Category
          </button>
        </div>
      </form>
    </>
  );
};

export default AddCategory;
