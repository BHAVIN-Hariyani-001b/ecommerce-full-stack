import { lazy, memo, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashHeader from "../../components/Dashbord/DashHeader";
import BottomMenu from "../../components/common/BottomMenu";
import SkeletonDash from "../../components/common/SkeletonDash";
import SideBar from "../../components/Sidebar/SideBar";
import AddProduct from "../../components/product_add/AddProduct";
import Category from "../../components/category/Category";
import Container from "../../components/common/Container";
import Product from "../../components/product_show/Product";
import BrandAdd from "../../components/brand/BrandAdd";
import ShowUser from "../../components/user/ShowUser";
import AddAttributes from "../../components/attribute/AddAttributes";

import { MdDashboard } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { MdShoppingCart } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";

const BOTTOM_MENU_ITEMS = [
  {
    icon: <MdDashboard size={25} color="#5c647a" />,
    itemName: "Dashboard",
  },
  {
    icon: <FaBoxArchive size={21} color="#5c647a" />,
    itemName: "Products",
  },
  {
    icon: <MdShoppingCart size={25} color="#5c647a" />,
    itemName: "Orders",
  },
  {
    icon: <AiFillSetting size={25} color="#5c647a" />,
    itemName: "Settings",
  },
];

const DashMain = lazy(() => import("../../components/Dashbord/DashMain"));
// const AddProduct = lazy(() => import("../../components/AddProduct"));

const Dashboard = memo(function Dashboard() {
  const isAdmin = useSelector((state) => state.auth?.isAdmin);
  const [activePage, setActivePage] = useState("dashboard");
  // console.log(activePage);

  const [sideBar, setSideBar] = useState(false);

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-fit shadow-lg shadow-black-1px border border-gray-200">
        <DashHeader setSideBar={setSideBar} sideBar={sideBar} />
      </header>
      <main
        className={`flex-8 overflow-auto relative h-full w-full scrollbar-none ${sideBar && "overflow-hidden"}`}
      >
        {activePage === "dashboard" ? (
          <Suspense fallback={<SkeletonDash />}>
            <DashMain setActivePage={setActivePage} />
          </Suspense>
        ) : (
          <Container setActivePage={setActivePage}>
            {activePage === "Category" && <Category />}
            {activePage == "products" && (
              <Product setActivePage={setActivePage} />
            )}
            {activePage == "Add Product" && (
              <AddProduct setActivePage={setActivePage} />
            )}
            {activePage == "Brand" && <BrandAdd />}
            {activePage == "User" && <ShowUser />}
            {activePage == "Attribute" && <AddAttributes />}
          </Container>
        )}
        <SideBar
          setSideBar={setSideBar}
          sideBarOpen={sideBar}
          setActivePage={setActivePage}
        />
      </main>
      <footer className="flex-1 shadow-[0_-8px_16px_rgba(0,0,0,0.15)] border-t border-[#c3bfd5] p-1">
        <BottomMenu
          BOTTOM_MENU_ITEMS={BOTTOM_MENU_ITEMS}
          setActivePage={setActivePage}
        />
      </footer>
    </div>
  );
});

export default Dashboard;
