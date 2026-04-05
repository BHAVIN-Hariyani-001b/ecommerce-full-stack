import PageWapper from "./PageWapper";
import All from "../cards/All";
import FoodCard from "../cards/FoodCard";
import FashionCard from "../cards/FashionCard";
import ElectronicsCard from "../cards/ElectronicsCard";
import BeautyCard from "../cards/BeautyCard";
import MobileCard from "../cards/MobileCard";
import HomeCard from "../cards/HomeCard";
// import { useSelector, useDispatch } from "react-redux";
// import { setCategory } from "../../features/category/categotySlice";

const Navbar = () => {
  // this is get data from in db use of api

  // const active = useSelector((state) => state.active);
  // const dispatch = useDispatch();

  const category = [
    { id: 1, name: "All" },
    { id: 2, name: "FashionCard" },
    { id: 3, name: "MobileCard" },
    { id: 4, name: "BeautyCard" },
    { id: 5, name: "ElectronicsCard" },
    { id: 6, name: "HomeCard" },
    { id: 7, name: "FoodCard" },
  ];

  const cardMap = {
    All: <All />,
    Food: <FoodCard />,
    Fashion: <FashionCard />,
    Electronics: <ElectronicsCard />,
    BeautyCard: <BeautyCard />,
    MobileCard: <MobileCard />,
    HomeCard: <HomeCard />,
  };

  const handleCategory = () => {
    // dispatch(setCategory(category.name));
  };

  return (
    <div className="py-2 flex justify-center items-center">
      <PageWapper>
        <div className="w-screen">
          <div className="flex gap-4 overflow-auto scrollbar-none">
            {category.map((category) => (
              <button
                key={category.id}
                onClick={handleCategory}
                className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded-4xl"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </PageWapper>
    </div>
  );
};

export default Navbar;
