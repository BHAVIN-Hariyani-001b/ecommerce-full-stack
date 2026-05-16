import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashHeader from "../../components/DashHeader";
import BottomMenu from "../../components/BottomMenu";

const Dashboard = () => {
  const userRoll = useSelector((state) => state.auth?.userRole);
  const navigate = useNavigate();

  if (userRoll !== "admin") {
    navigate("/");
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-fit shadow-lg shadow-black-1px border border-gray-200">
        <DashHeader />
      </header>
      <main className="flex-8">
      </main>
      <footer className="flex-1 shadow-[0_-8px_16px_rgba(0,0,0,0.15)] border-t border-[#c3bfd5] p-1">
        <BottomMenu />
      </footer>
    </div>
  );
};

export default Dashboard;
