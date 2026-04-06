import PageWapper from "./PageWapper";
import { useSelector, useDispatch } from "react-redux";
import { setCategory } from "../../features/category/categotySlice";

const Navbar = () => {
  // this is get data from in db use of api

  const active = useSelector((state) => state.active);
  const dispatch = useDispatch();

  // console.log(active);

  const category = [
    {
      id: 1,
      name: "All",
      nameOfCategory: "All",
      imagePath: "../../../public/image/all.png",
    },
    {
      id: 2,
      name: "Fashion",
      nameOfCategory: "FashionCard",
      imagePath: "../../../public/image/feshion.png",
    },
    {
      id: 3,
      name: "Mobile",
      nameOfCategory: "MobileCard",
      imagePath: "../../../public/image/mobile.png",
    },
    {
      id: 4,
      name: "Beauty",
      nameOfCategory: "BeautyCard",
      imagePath: "../../../public/image/Beauty.png",
    },
    {
      id: 5,
      name: "Electronics",
      nameOfCategory: "ElectronicsCard",
      imagePath: "../../../public/image/electronics.png",
    },
    {
      id: 6,
      name: "Home",
      nameOfCategory: "HomeCard",
      imagePath: "../../../public/image/Home.png",
    },
    {
      id: 7,
      name: "Food",
      nameOfCategory: "FoodCard",
      imagePath: "../../../public/image/Food.png",
    },
  ];

  const handleCategory = (name) => {
    dispatch(setCategory(name));
  };

  return (
    <div className="py-2 px-2 w-full flex justify-center border-b-2 border-gray-200">
      <PageWapper className={"overflow-x-auto scrollbar-none rounded-xl"}>
        <div className="flex items-center gap-4">
          {category.map((category) => {
            const isActive = category.nameOfCategory;
            // console.log(isActive);
            return (
              <button
                key={category.id}
                onClick={() => handleCategory(category.nameOfCategory)}
                className={[
                  "cursor-pointer text-black relative font-medium px-4 py-2 flex justify-center items-center gap-1 rounded",
                  isActive === active ? "border-b-2 border-blue-500 ease-in transition-all delay-250" : "border-b-transparent border-b-2  hover:border-b-2 hover:border-gray-300",
                ].join(" ")}
              >
                <img src={category.imagePath} alt="" className="w-7" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </PageWapper>
    </div>
  );
};

export default Navbar;
