import { TbEdit } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setIsUpdated } from "../../../admin/features/category/categorySlice";
// import { toast } from "react-toastify";

const CategoryList = ({ popup }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.adminCategory.category);
  console.log(categories)
  return (
    <>
      {categories?.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl flex items-center justify-between p-4 group cursor-all-scroll"
        >
          <div className="flex gap-5">
            <div className="w-15 h-15 border border-gray-200 rounded">
              <img
                src={`../../../../public/image/category_img/${item?.image}`}
                alt={item?.name}
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[16px]">{item?.name}</p>
              <p
                className={`text-[12px] bg-gray-100 px-1 w-fit rounded-full ${item?.status === "active" ? "text-green-500" : "text-red-400"}`}
              >
                {item?.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xl">
            <button
              onClick={() => dispatch(setIsUpdated(item))}
              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 hover:scale-105 p-1 rounded-full"
            >
              <TbEdit />
            </button>
            <button
              onClick={() => {
                dispatch(setIsUpdated(item?.id));
                popup(true);
              }}
              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 p-1 hover:scale-105 rounded-full"
            >
              <MdOutlineDelete />
            </button>
            <div className="group-hover:translate-x-2 transition-all">
              <IoIosArrowForward />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CategoryList;
