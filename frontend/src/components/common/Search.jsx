import { RxCross2 } from "react-icons/rx";
import { MdOutlineSearch } from "react-icons/md";
import { memo, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearSearch } from "../../features/search/searchSlice";
import { IoIosArrowBack } from "react-icons/io";

const Search = memo(function Search({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchValue(value);
      onSearch?.(value);
    },
    [onSearch],
  );

  const location = useLocation();
  const searchPath = location.pathname === "/search";
  const navigate = useNavigate();

  const handleClear = useCallback(() => {
    setSearchValue("");
    onSearch?.("");
    if (searchPath) {
      dispatch(clearSearch());
    }
  }, [onSearch, dispatch, searchPath]);

  const handleBackHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <label className="border border-gray-300 flex items-center justify-center bg-white text-[#454d5c] rounded-xl w-full h-12 py-2 px-4 gap-1">
      <IoIosArrowBack
        size={25}
        className="cursor-pointer hidden max-[600px]:block"
        onClick={handleBackHome}
      />

      <MdOutlineSearch className="text-2xl text-[#454d5c] max-[600px]:hidden" />

      <input
        type="text"
        className="w-full h-10 px-2 pb-0.5 outline-none text-[#454d5c]"
        autoComplete="off"
        name="search"
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearch}
      />
      {searchValue && (
        <RxCross2
          className="text-2xl cursor-pointer rounded-full"
          onClick={handleClear}
        />
      )}
    </label>
  );
});

export default Search;
