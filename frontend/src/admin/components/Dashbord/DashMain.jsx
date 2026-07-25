import { memo } from "react";
import Overview from "../Overview";
import QuickActions from "../QuickActions";
import RecentOrder from "../productOrder/RecentOrder";
import SideBar from "../Sidebar/SideBar";

const DashMain = memo(function DashMain({ setActivePage }) {
  return (
    <div>
      <Overview />
      <QuickActions setActivePage={setActivePage} />
      <RecentOrder />
    </div>
  );
});

export default DashMain;
