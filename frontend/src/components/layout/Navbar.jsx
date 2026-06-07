import PageWapper from "./PageWapper";
import { useSelector, useDispatch } from "react-redux";
import { memo, useCallback, useEffect } from "react";
import { setCategory } from "../../features/category/categotySlice";
import { fetchCategories } from "../../features/category/categoryThunk";

const CategoryButton = memo(function CategoryButton({
  name,
  image,
  isActive,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      className={[
        "cursor-pointer text-black relative font-medium px-4 py-2 flex justify-center items-center gap-1 rounded",
        isActive
          ? "border-b-2 border-blue-500 ease-in transition-all delay-250"
          : "border-b-transparent border-b-2  hover:border-b-2 hover:border-gray-300",
      ].join(" ")}
    >
      <img
        src={`../../../public/image/category_img/${image}`}
        alt=""
        className="w-7"
      /> 
      <span>{name}</span>
    </button>
  );
});

const Navbar = memo(function Navbar() {
  const active = useSelector((state) => state.userCategory.active);
  const category = useSelector((state) => state.userCategory.category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategory = useCallback(
    (name) => {
      dispatch(setCategory(name));
    },
    [dispatch],
  );

  return (
    <div className="py-2 px-2 w-full flex justify-center border-b-2 border-gray-200 z-0">
      <PageWapper className={"overflow-x-auto scrollbar-none rounded"}>
        <div className="flex items-center gap-10 max-[1000px]:gap-5">
          {category?.map((item) =>
            item?.status === "active" ? (
              <CategoryButton
                key={item?.id}
                name={item?.name}
                image={item?.image}
                isActive={item?.name === active}
                onSelect={handleCategory}
              />
            ) : null,
          )}
        </div>
      </PageWapper>
    </div>
  );
});

export default Navbar;
