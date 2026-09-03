import { IoMdAdd } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../../features/category/categoryThunk";
import toast from "react-hot-toast";
import { useState } from "react";
import DeletePopup from "../common/DeletePopup";

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
            <div className="max-h-125 overflow-y-auto space-y-3">
              <CategoryList popup={setIsOpen} />
            </div>
          </div>
        </div>
      </div>
      { isOpen && (
        <DeletePopup
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

export default Category;
