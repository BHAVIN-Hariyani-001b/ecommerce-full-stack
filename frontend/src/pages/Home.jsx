import Header from "../components/layout/Header";
import Fotter from "../components/layout/Footer";
import { useSelector } from "react-redux";
import All from "../components/cards/All";
import ProductSection from "../components/cards/ProductSection";
import { useEffect } from "react";

const Home = () => {
  const active = useSelector((state) => state.active);
  useEffect(()=>{
    console.log("Hello")
  },[])
  const renderMain = () => {
    if (active == "All") {
      return (
        <div className="flex w-full max-w-6xl justify-center px-4 py-6">
          <All />
        </div>
      );
    }

    return (
      <div className="flex w-full max-w-6xl justify-center px-4 py-6">
        <ProductSection ProductSection={active} />
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
