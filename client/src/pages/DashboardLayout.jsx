import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import { useEffect, useState } from "react";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import Breadcrumbs from "../components/Navigation/Breadcrumbs";
import { Toaster, toast } from "sonner";

const mainStyle = {
  paddingLeft: "var(--sidebar-width)",
  maxWidth: "1400px",
  margin: "auto",
};

export default function DashboardLayout() {
  // useEffect(() => {
  //   document.body.style.backgroundColor = "#f3f3f3";

  //   return () => {
  //     document.body.style.backgroundColor = "";
  //   };
  // }, []);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/") &&
      navigate("/dashboard/overview");
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
            // backgroundColor: "#f3f3f3",
            borderRadius: "10px",
            // margin: "1.25rem",
            padding: "0.5rem",
            // boxShadow:
            //   "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.1) 0px 0px 0px 1px",
          }}
          className="content"
        >
          <Outlet />
        </motion.div>
      </main>
      {/* <Toaster position="bottom-center" richColors /> */}
      <Toaster position="bottom-center" />
    </div>
  );
}
