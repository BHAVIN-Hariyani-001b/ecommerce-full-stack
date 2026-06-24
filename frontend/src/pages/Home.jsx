import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import All from "../components/cards/All";
import ProductSection from "../components/cards/ProductSection";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const RenderMain = memo(function RenderMain({ active }) {
  if (active === "All") {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <All />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 px-4 py-6">
      <ProductSection />
    </div>
  );
});

const Home = memo(function Home() {
  const active = useSelector((state) => state.userCategory.active);
  const mainContent = useMemo(() => <RenderMain active={active} />, [active]);

  return (
    <div>
      <Helmet>
        <title>Venture - Shop Online</title>
        <meta
          name="description"
          content="Shop fashion, mobile and more at Venture"
        />
      </Helmet>
      <main className="flex min-w-0 justify-center overflow-x-hidden">
        {mainContent}
      </main>
    </div>
  );
});

export default Home;
