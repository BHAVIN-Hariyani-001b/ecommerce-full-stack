import { IoMdAdd } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../../features/category/categoryThunk";
import { toast } from "react-toastify";
import { useState } from "react";

const Category = () => {
  const isUpdated = useSelector((state) => state.adminCategory.isUpdated);
  const dispatch = useDispatch();
  console.log(isUpdated);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteCategory(id));
      toast.success("Category deleted successfully");
    }
  };

  return (
    <>
      <div className="px-4 py-3 w-full h-full grid grid-cols-2 max-[900px]:flex max-[900px]:flex-col">
        <div className=" p-4">
          <div className="border border-gray-200 p-5 rounded-xl">
            <h1 className="font-semibold py-5 text-xl flex items-center gap-2">
              {!isUpdated ? (
                <>
                  <IoMdAdd className="inline-block text-2xl" /> Add New Category
                </>
              ) : (
                <>
                  <MdOutlineCategory className="inline-block text-2xl" /> Update
                  Category
                </>
              )}
            </h1>
            <AddCategory data={isUpdated} />
          </div>
        </div>
        <div className="p-4">
          <div className="border border-gray-200 p-5 rounded-xl relative">
            <h1 className="font-semibold py-5 text-xl">Category</h1>
            <div className="scrollbar-none max-h-125 overflow-y-auto space-y-3">
              <CategoryList popup={setIsOpen} />
            </div>
          </div>
        </div>
      </div>
      { isOpen && (
        <DeleteCategoryPopup
          onClose={() => setIsOpen(false)}
          handleDelete={() => {
            handleDelete(isUpdated);
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
};

const DeleteCategoryPopup = ({ onClose, handleDelete }) => {
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center  justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this category?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;
