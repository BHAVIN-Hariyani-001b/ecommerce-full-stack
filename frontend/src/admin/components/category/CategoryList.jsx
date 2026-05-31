import { TbEdit } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";


const CategoryList = () => {
  return (
    <>
      <div className="border border-gray-200 rounded-xl flex items-center justify-between p-4 group cursor-pointerr">
        <div className="flex gap-5">
          <div className="w-15 h-15 bg-red-300 rounded"></div>
          <div>
            <p className="text-[16px]">Electronic</p>
            <span className="text-[13px]">452 Product</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-xl">
          <div className="">
            <TbEdit />
          </div>
          <div className="group-hover:translate-x-2 transition-all">
            <IoIosArrowForward />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
