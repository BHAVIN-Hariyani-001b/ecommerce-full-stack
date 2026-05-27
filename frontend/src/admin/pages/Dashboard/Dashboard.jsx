import { lazy, memo, Suspense, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashHeader from "../../components/DashHeader";
import BottomMenu from "../../components/BottomMenu";
import AddProduct from "../../components/AddProduct";
import SkeletonDash from "../../components/common/SkeletonDash";

const DashMain = lazy(() => import("../../components/DashMain"));

const Dashboard = memo(function Dashboard() {
  const userRoll = useSelector((state) => state.auth?.userRole);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleBack = useCallback(() => setShowAddProduct(false), []);
  const handleAddProduct = useCallback(() => setShowAddProduct(true), []);

  if (userRoll === "user") {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-fit shadow-lg shadow-black-1px border border-gray-200">
        <DashHeader />
      </header>
      <main className="flex-8 overflow-auto">
        {showAddProduct ? (
          <AddProduct onBack={handleBack} />
        ) : (
          <Suspense fallback={<SkeletonDash />}>
            <DashMain onAddProduct={handleAddProduct} />
          </Suspense>
        )}
      </main>
      <footer className="flex-1 shadow-[0_-8px_16px_rgba(0,0,0,0.15)] border-t border-[#c3bfd5] p-1">
        <BottomMenu />
      </footer>
    </div>
  );
});

export default Dashboard;
