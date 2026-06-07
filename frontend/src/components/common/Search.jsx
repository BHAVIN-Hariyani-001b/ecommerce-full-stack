import { RxCross2 } from "react-icons/rx";
import { MdOutlineSearch } from "react-icons/md";
import { memo, useCallback, useState } from "react";

const Search = memo(function Search() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);

  const handleClear = useCallback(() => {
    setSearchValue("");
    setSearchActive(false);
  }, []);

  return (
    <label className="border border-gray-300 flex items-center justify-center bg-white text-[#454d5c] rounded-xl w-full h-12 py-2 px-4 gap-1">
      <MdOutlineSearch className="text-2xl text-[#454d5c]" />
      <input
        type="text"
        className="w-full h-10 px-2 pb-0.5 outline-none text-[#454d5c]"
        autoComplete="off"
        name="search"
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearch}
      />
      {searchActive ? (
        <RxCross2
          className="text-2xl cursor-pointer rounded-full"
          onClick={handleClear}
        />
      ) : null}
    </label>
  );
});

export default Search;
