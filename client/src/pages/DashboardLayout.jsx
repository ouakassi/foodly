import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";

import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import Header from "../components/Navigation/Header";
import { useEffect, useState } from "react";

const mainStyle = {
  padding: "var(--header-height) 0 0 var(--sidebar-width)",
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    location.pathname === "/dashboard" && navigate("/dashboard/overview");
  }, [location, navigate]);

  return (
    <div className="dashboard">
      <DashboardSidebar />
      {/* <Header /> */}
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}
