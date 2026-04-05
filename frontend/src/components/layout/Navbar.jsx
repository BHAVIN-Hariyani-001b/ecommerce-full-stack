import PageWapper from "./PageWapper";
import { useSelector, useDispatch } from "react-redux";
import { setCategory } from "../../features/category/categotySlice";

const Navbar = () => {
  // this is get data from in db use of api

  const active = useSelector((state) => state.active);
  const dispatch = useDispatch();

  console.log(active);

  const category = [
    { id: 1, name: "All" },
    { id: 2, name: "FashionCard" },
    { id: 3, name: "MobileCard" },
    { id: 4, name: "BeautyCard" },
    { id: 5, name: "ElectronicsCard" },
    { id: 6, name: "HomeCard" },
    { id: 7, name: "FoodCard" },
  ];

  const handleCategory = (name) => {
    dispatch(setCategory(name));
  };

  return (
    <div className="py-2 px-2 w-full flex justify-center">
      <PageWapper className={"overflow-x-auto scrollbar-none rounded-xl"}>
        <div className="flex items-center gap-4">
          {category.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategory(category.name)}
              className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded-4xl"
            >
              {category.name}
            </button>
          ))}
        </div>
      </PageWapper>
    </div>
  );
};

export default Navbar;
