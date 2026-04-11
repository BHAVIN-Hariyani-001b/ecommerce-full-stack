import PageWapper from "./PageWapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  fetchCategories,
  setCategory,
} from "../../features/category/categotySlice";

const Navbar = () => {
  // this is get data from in db use of api
  const active = useSelector((state) => state.active);
  const category = useSelector((state) => state.category);
  // console.log(category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategory = (name) => {
    dispatch(setCategory(name));
  };

  return (
    <div className="py-2 px-2 w-full flex justify-center border-b-2 border-gray-200">
      <PageWapper className={"overflow-x-auto scrollbar-none rounded"}>
        <div className="flex items-center gap-4">
          {category.map((category) => {
            const isActive = category.name == "All" ? category?.name : category?.name + "Card";
            return (
              <button
                key={category?.id}
                onClick={() => handleCategory(isActive)}
                className={[
                  "cursor-pointer text-black relative font-medium px-4 py-2 flex justify-center items-center gap-1 rounded",
                  isActive === active
                    ? "border-b-2 border-blue-500 ease-in transition-all delay-250"
                    : "border-b-transparent border-b-2  hover:border-b-2 hover:border-gray-300",
                ].join(" ")}
              >
                <img src={`../../../public/image/${category?.image}`} alt="" className="w-7" />
                <span>{category?.name}</span>
              </button>
            );
          })}
        </div>
      </PageWapper>
    </div>
  );
};

export default Navbar;
