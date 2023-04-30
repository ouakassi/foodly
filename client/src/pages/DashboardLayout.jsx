import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import { useEffect, useState } from "react";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import Breadcrumbs from "../components/Navigation/Breadcrumbs";

const mainStyle = {
  paddingLeft: "var(--sidebar-width)",
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
      {/* <DashboardNavbar />  */}
      <main style={mainStyle}>
        <Breadcrumbs />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            margin: "1rem",
            padding: "1rem",
          }}
          className="content"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
