import PageWapper from "./PageWapper";
import { useSelector, useDispatch } from "react-redux";
import { memo, useCallback, useEffect, useState } from "react";
import { setCategory } from "../../features/category/categotySlice";
import { fetchCategories } from "../../features/category/categoryThunk";

const CategoryButton = memo(function CategoryButton({ name, image, onSelect }) {
  return (
    <button
      type="button"
      onClick={(e) => onSelect(e, name)}
      className={[
        "cursor-pointer text-black relative font-medium px-4 py-2 flex justify-center items-center gap-1 rounded",
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
  const category = useSelector((state) => state.userCategory.category);
  const dispatch = useDispatch();

  const [categoryPos, setCategoryPos] = useState("8px");
  const [categoryWidth, setCategoryWidth] = useState("83.11");

  // console.log(categoryPos);
  // console.log(categoryWidth);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategory = useCallback(
    (e, name) => {
      dispatch(setCategory(name));

      const buttonRect = e.currentTarget.getBoundingClientRect();
      const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
      // console.log(buttonRect);
      // console.log(parentRect);

      setCategoryPos(buttonRect.left - parentRect.left);
      setCategoryWidth(buttonRect.width);
    },
    [dispatch],
  );

  return (
    <div className="px-2 w-full flex justify-center border-b-2 border-gray-200 z-0">
      <PageWapper className={"overflow-x-auto scrollbar-none rounded relative"}>
        <div className="flex items-center gap-10 max-[1000px]:gap-5 py-1">
          {category?.map((item) =>
            item?.status === "active" && !item?.parent_id ? (
              <CategoryButton
                key={item?.id}
                name={item?.name}
                image={item?.image}
                onSelect={handleCategory}
              />
            ) : null,
          )}
        </div>
        <div
          className="absolute bottom-0 h-1/15 rounded-t-2xl bg-blue-700 transition-all duration-300"
          style={{
            width: categoryWidth + "px",
            transform: `translateX(${categoryPos}px)`,
          }}
        ></div>
      </PageWapper>
    </div>
  );
});

export default Navbar;
