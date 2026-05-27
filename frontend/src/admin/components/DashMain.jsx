import { memo } from "react";
import Overview from "./Overview";
import QuickActions from "./QuickActions";
import RecentOrder from "./RecentOrder";

const DashMain = memo(function DashMain({ onAddProduct }) {
  return (
    <div>
      <Overview />
      <QuickActions onAddProduct={onAddProduct} />
      <RecentOrder />
    </div>
  );
});

export default DashMain;
