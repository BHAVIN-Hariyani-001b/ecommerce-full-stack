import { IoMdAdd } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";

const Category = () => {
  return (
    <div className="px-4 py-3 w-full h-full grid grid-cols-2 max-[900px]:flex max-[900px]:flex-col">
      <div className=" p-4">
        <div className="border border-gray-200 p-5 rounded-xl">
          <h1 className="font-semibold py-5 text-xl">Add Category</h1>
          <AddCategory />
        </div>
      </div>

      <div className="p-4">
        <div className="border border-gray-200 p-5 rounded-xl">
          <h1 className="font-semibold py-5 text-xl">Category</h1>
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

export default Category;
