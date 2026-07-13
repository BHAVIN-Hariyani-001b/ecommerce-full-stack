import { lazy, memo, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashHeader from "../../components/DashHeader";
import BottomMenu from "../../components/BottomMenu";
import SkeletonDash from "../../components/common/SkeletonDash";
import SideBar from "../../components/Sidebar/SideBar";
import AddProduct from "../../components/AddProduct";
import Category from "../../components/category/Category";
import Container from "../../components/common/Container";
import Product from "../../components/product_show/Product";
import BrandAdd from "../../components/brand/BrandAdd";

const DashMain = lazy(() => import("../../components/DashMain"));
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
            {activePage == "Brand" && (
              <BrandAdd setActivePage={setActivePage} />
            )}
          </Container>
        )}
        <SideBar
          setSideBar={setSideBar}
          sideBarOpen={sideBar}
          setActivePage={setActivePage}
        />
      </main>
      <footer className="flex-1 shadow-[0_-8px_16px_rgba(0,0,0,0.15)] border-t border-[#c3bfd5] p-1">
        <BottomMenu setActivePage={setActivePage} />
      </footer>
    </div>
  );
});

export default Dashboard;
