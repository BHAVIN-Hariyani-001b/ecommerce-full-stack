import Header from "../components/layout/Header";
import Fotter from "../components/layout/Footer";
import { useSelector } from "react-redux";
import FashionCard from "../components/cards/FashionCard";
import MobileCard from "../components/cards/MobileCard";
import BeautyCard from "../components/cards/BeautyCard";
import ElectronicsCard from "../components/cards/ElectronicsCard";
import HomeCard from "../components/cards/HomeCard";
import FoodCard from "../components/cards/FoodCard";
import All from "../components/cards/All";

const CARD_BY_CATEGORY = {
  All,
  FashionCard,
  MobileCard,
  BeautyCard,
  ElectronicsCard,
  HomeCard,
  FoodCard,
};

const Home = () => {
  const active = useSelector((state) => state.active);
  const renderMain = () => {
    const Card = CARD_BY_CATEGORY[active];
    console.log(CARD_BY_CATEGORY)
    if (!Card) return null;

    return (
      <div className="flex w-full max-w-6xl justify-center px-4 py-6">
        <Card />
      </div>
    );
  };

  return (
    <div>
      <Header />
      <main className="flex justify-center">{renderMain()}</main>
      <Fotter />
    </div>
  );
};

export default Home;
