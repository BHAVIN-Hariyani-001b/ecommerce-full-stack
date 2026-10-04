import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineSearch } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BiCategory } from "react-icons/bi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { setCategory } from "../../features/category/categotySlice";
import { fetchCategories } from "../../features/category/categoryThunk";

const CategoryTile = memo(function CategoryTile({
  name,
  image,
  isActive,
  onSelect,
  isAll,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      className={[
        "relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-all active:scale-[0.97]",
        isActive
          ? "border-[#8685ef] bg-[#f3f2ff] shadow-[0_0_0_3px_rgba(134,133,239,0.18)]"
          : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white",
      ].join(" ")}
    >
      {isActive ? (
        <IoCheckmarkCircle className="absolute top-1.5 right-1.5 text-lg text-[#8685ef]" />
      ) : null}

      <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white">
        {isAll ? (
          <BiCategory className="text-3xl text-[#8685ef]" />
        ) : (
          <img
            src={`/image/category_img/${image}`}
            alt=""
            className="h-11 w-11 object-contain"
          />
        )}
      </span>

      <span
        className={[
          "line-clamp-2 w-full text-[13px] leading-tight font-medium",
          isActive ? "text-[#5b5ad6]" : "text-[#2b2f3a]",
        ].join(" ")}
      >
        {name}
      </span>
    </button>
  );
});

const CategoryPicker = memo(function CategoryPicker({ open, onClose }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.userCategory.category);
  const active = useSelector((state) => state.userCategory.active);
  const loading = useSelector((state) => state.userCategory.loading);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open && (!categories || categories.length === 0)) {
      dispatch(fetchCategories());
    }
  }, [open, categories, dispatch]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const queryText = query.trim().toLowerCase();
  const showAllOption = !queryText || "all".includes(queryText);

  const visibleCategories = useMemo(() => {
    const list = (categories ?? []).filter(
      (item) =>
        String(item?.status).toLowerCase() === "active" &&
        !item?.parent_id &&
        item?.name?.toLowerCase() !== "all",
    );
    if (!queryText) return list;
    return list.filter((item) => item?.name?.toLowerCase().includes(queryText));
  }, [categories, queryText]);

  const handleSelect = useCallback(
    (name) => {
      dispatch(setCategory(name));
      onClose?.();
    },
    [dispatch, onClose],
  );

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleClearQuery = useCallback(() => {
    setQuery("");
  }, []);

  const resultCount =
    visibleCategories.length + (showAllOption ? 1 : 0);

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-40 min-[600px]:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Categories"
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-label="Close categories"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute right-0 bottom-20 left-0 flex max-h-[78vh] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-12px_40px_rgba(43,47,58,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-2.5 h-1.5 w-12 rounded-full bg-gray-200" />

            <div className="flex items-start justify-between gap-3 px-5 pt-3 pb-2">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#2b2f3a]">
                  Shop by category
                </h2>
                <p className="mt-0.5 text-xs text-[#8a93a6]">
                  {loading && visibleCategories.length === 0
                    ? "Loading..."
                    : `${resultCount} ${resultCount === 1 ? "category" : "categories"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-0.5 rounded-full bg-gray-100 p-2 text-[#586274] transition-colors active:bg-gray-200"
                aria-label="Close"
              >
                <RxCross2 className="text-lg" />
              </button>
            </div>

            <div className="px-4 pb-3">
              <label className="flex h-11 w-full items-center gap-1 rounded-full bg-[#f4f6fa] px-3.5 text-[#454d5c] ring-1 ring-transparent focus-within:bg-white focus-within:ring-[#8685ef]/40">
                <MdOutlineSearch className="text-2xl text-[#8a93a6]" />
                <input
                  type="text"
                  name="categorySearch"
                  autoComplete="off"
                  placeholder="Search category..."
                  value={query}
                  onChange={handleQueryChange}
                  className="h-10 w-full bg-transparent px-1 text-sm outline-none placeholder:text-[#a7b0c0]"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="rounded-full p-1 text-[#8a93a6] active:bg-gray-200"
                    aria-label="Clear search"
                  >
                    <RxCross2 className="text-lg" />
                  </button>
                ) : null}
              </label>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 scrollbar-none">
              {loading && visibleCategories.length === 0 ? (
                <div className="grid grid-cols-3 gap-2.5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-28 animate-pulse rounded-2xl bg-gray-100"
                    />
                  ))}
                </div>
              ) : null}

              {!loading && visibleCategories.length === 0 && !showAllOption ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f2ff] text-[#8685ef]">
                    <BiCategory className="text-2xl" />
                  </span>
                  <p className="font-medium text-[#2b2f3a]">No category found</p>
                  <p className="mt-1 text-sm text-[#8a93a6]">
                    Try a different search
                  </p>
                </div>
              ) : null}

              {(!loading || visibleCategories.length > 0 || showAllOption) &&
              (showAllOption || visibleCategories.length > 0) ? (
                <div className="grid grid-cols-3 gap-2.5">
                  {showAllOption ? (
                    <CategoryTile
                      name="All"
                      isAll
                      isActive={active === "All"}
                      onSelect={handleSelect}
                    />
                  ) : null}

                  {visibleCategories.map((item) => (
                    <CategoryTile
                      key={item?.id ?? item?.name}
                      name={item?.name}
                      image={item?.image}
                      isActive={item?.name === active}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
});

export default CategoryPicker;
