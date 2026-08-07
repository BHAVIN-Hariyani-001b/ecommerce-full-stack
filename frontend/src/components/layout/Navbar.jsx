import PageWapper from "./PageWapper";
import { useSelector, useDispatch } from "react-redux";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { setCategory } from "../../features/category/categotySlice";
import { fetchCategories } from "../../features/category/categoryThunk";

const CategoryButton = memo(function CategoryButton({
  name,
  image,
  onSelect,
  isActive,
  btnRef,
}) {
  return (
    <button
      ref={btnRef}
      type="button"
      onClick={(e) => onSelect(e, name)}
      className={[
        "cursor-pointer text-black relative font-medium px-4 py-2 flex justify-center items-center gap-1 rounded",
        isActive ? "text-blue-600" : "",
      ].join(" ")}
    >
      <img src={`/image/category_img/${image}`} alt="" className="w-7" />
      <span>{name}</span>
    </button>
  );
});

const Navbar = memo(function Navbar() {
  const category = useSelector((state) => state.userCategory.category);
  const dispatch = useDispatch();

  const btnRefs = useRef({});

  const active = useSelector((state) => state.userCategory.active);
  const [categoryPos, setCategoryPos] = useState(0);
  const [categoryWidth, setCategoryWidth] = useState(0);

  console.log(active);


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const measureUnderline = useCallback((btnEl) => {
    if (!btnEl) return;
    const buttonRect = btnEl.getBoundingClientRect();
    const parentRect = btnEl.parentElement.getBoundingClientRect();
    setCategoryPos(buttonRect.left - parentRect.left);
    setCategoryWidth(buttonRect.width);
  }, []);

  useEffect(() => {
    if (!active) return;
    const activeBtn = btnRefs.current[active];
    if (activeBtn) {
      const id = requestAnimationFrame(() => measureUnderline(activeBtn));
      return () => cancelAnimationFrame(id);
    }
  }, [active, category, measureUnderline]);

  const handleCategory = useCallback(
    (e, name) => {
      dispatch(setCategory(name));
      measureUnderline(e.currentTarget);
    },
    [dispatch, measureUnderline],
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
                isActive-={item?.name === active}
                btnRef={(el) => {
                  if (el) btnRefs.current[item.name] = el;
                }}
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
