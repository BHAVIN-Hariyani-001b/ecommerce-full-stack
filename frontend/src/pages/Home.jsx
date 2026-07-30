import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import All from "../components/cards/All";
import ProductSection from "../components/cards/ProductSection";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { TbHome } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { GrCart } from "react-icons/gr";

import { FaRegCircleUser } from "react-icons/fa6";
import BottomMenu from "../admin/components/common/BottomMenu";


const BOTTOM_MENU_ITEMS = [
  {
    icon: <TbHome size={25} color="#5c647a" />,
    itemName: "Home",
  },
  {
    icon: <BiCategory size={25} color="#5c647a" />,
    itemName: "Category",
  },
  {
    icon: <GrCart size={22} color="#5c647a" />,
    itemName: "Cart",
  },
  {
    icon: <FaRegCircleUser size={22} color="#5c647a" />,
    itemName: "Profile",
  },
];

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
      <main className="scrollbar-none">
        <div className="pb-20">{mainContent}</div>
        <div className="w-full fixed bottom-0 z-30 border-t border-gray-200 bg-white p-2 min-[600px]:hidden">
          <BottomMenu BOTTOM_MENU_ITEMS={BOTTOM_MENU_ITEMS} />
        </div>
      </main>
    </div>
  );
});

export default Home;
