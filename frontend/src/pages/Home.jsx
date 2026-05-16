import Header from "../components/layout/Header";
import Fotter from "../components/layout/Footer";
import { useSelector } from "react-redux";
import All from "../components/cards/All";
import ProductSection from "../components/cards/ProductSection";
import useAuth from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const active = useSelector((state) => state.category.active);
  const userRoll = useSelector((state) => state.auth?.userRole);
  useAuth(); // Automatically fetch user profile if token exists
  const navigate = useNavigate();

  if (userRoll === "admin") {
    navigate("/admin");
  }

  return (
    <div>
      <Header />
      <main className="flex justify-center">
        <RenderMain active={active} />
      </main>
      <Fotter />
    </div>
  );
};

const RenderMain = ({ active }) => {
  if (active == "All") {
    return (
      <div className="flex w-full max-w-6xl justify-center px-4 py-6">
        <All />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-6xl justify-center px-4 py-6">
      <ProductSection category={active} />
    </div>
  );
};

export default Home;
