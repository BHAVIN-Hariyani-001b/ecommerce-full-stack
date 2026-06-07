import { memo, useMemo } from "react";
import Header from "../components/layout/Header";
import Fotter from "../components/layout/Footer";
import { useSelector } from "react-redux";
import All from "../components/cards/All";
import ProductSection from "../components/cards/ProductSection";
import { Navigate } from "react-router-dom";
import useAdminVerify from "../hook/useAdminVerify";

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
  const active = useSelector((state) => state.userCategory.active);
  const { isAdmin, isLoading, token } = useAdminVerify();

  const mainContent = useMemo(() => <RenderMain active={active} />, [active]);

  if (token && isLoading) return null;
  if (isAdmin) return <Navigate to="/admin" />;

  return (
    <div>
      <Header />
      <main className="flex justify-center">{mainContent}</main>
      <Fotter />
    </div>
  );
});

export default Home;
