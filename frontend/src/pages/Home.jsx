import { memo, useMemo } from "react";
import Header from "../components/layout/Header";
import Fotter from "../components/layout/Footer";
import { useSelector } from "react-redux";
import All from "../components/cards/All";
import ProductSection from "../components/cards/ProductSection";
import useAuth from "../hook/useAuth";
import { Navigate } from "react-router-dom";

const RenderMain = memo(function RenderMain({ active }) {
  if (active === "All") {
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
});

const Home = memo(function Home() {
  useAuth();
  const active = useSelector((state) => state.userCategory.active);
  const userRoll = useSelector((state) => state.auth?.userRole);

  const mainContent = useMemo(
    () => <RenderMain active={active} />,
    [active],
  );

  if (userRoll === "admin") {
    return <Navigate to="/admin" />;
  }

  return (
    <div>
      <Header />
      <main className="flex justify-center">{mainContent}</main>
      <Fotter />
    </div>
  );
});

export default Home;
