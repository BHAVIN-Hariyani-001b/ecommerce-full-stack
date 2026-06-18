import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import All from "../components/cards/All";
import ProductSection from "../components/cards/ProductSection";
import { Navigate } from "react-router-dom";
import useAdminVerify from "../hook/useAdminVerify";
import { Helmet } from "react-helmet-async";

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
      <ProductSection />
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
      <Helmet>
        <title>Venture - Shop Online</title>
        <meta
          name="description"
          content="Shop fashion, mobile and more at Venture"
        />
      </Helmet>
      <main className="flex justify-center">{mainContent}</main>
    </div>
  );
});

export default Home;
