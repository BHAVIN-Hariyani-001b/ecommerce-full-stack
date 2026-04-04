import PageWapper from "./PageWapper";
import All from "../cards/All";
import FoodCard from "../cards/FoodCard";
import FashionCard from "../cards/FashionCard";
import ElectronicsCard from "../cards/ElectronicsCard";
import BeautyCard from "../cards/BeautyCard";
import MobileCard from "../cards/MobileCard";
import HomeCard from "../cards/HomeCard";

const Navbar = () => {
  // this is get data from in db use of api
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

  return (
    <div className="py-5 bg-blue-50">
      <PageWapper>
        <div className="flex justify-center items-center space-x-10">
          {category.map((category) => (
            <button key={category.id} className="cursor-pointer">
              {category.name}
            </button>
          ))}
        </div>
      </PageWapper>
    </div>
  );
};

export default Navbar;
