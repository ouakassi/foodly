import "./DashboardSidebar.css";
import Logo from "../Navigation/Logo";
import {
  CiMemoPad,
  CiGrid41,
  CiShoppingCart,
  CiMoneyCheck1,
  CiUser,
  CiSun,
} from "react-icons/ci";
import {
  TbArrowAutofitContent,
  TbArrowAutofitContentFilled,
} from "react-icons/tb";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedIcon from "../Buttons/AnimatedIcon";

const navItems = [
  {
    icon: <CiGrid41 />,
    name: "overview",
  },
  {
    icon: <CiMoneyCheck1 />,
    name: "orders",
  },
  {
    icon: <CiUser />,
    name: "customers",
  },
  {
    icon: <CiShoppingCart />,
    name: "products",
  },
  {
    icon: <CiMemoPad />,
    name: "reports",
  },
];

export default function DashboardSidebar() {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  useEffect(() => {
    const spanElements = document.querySelectorAll(".dashboard__sidebar-text");
    spanElements.forEach(
      (span) => (span.style.display = toggleSidebar ? "none" : "block")
    );
  }, [toggleSidebar]);

  return (
    <motion.div
      animate={!toggleSidebar ? { width: "22rem" } : { width: "9rem" }}
      className="dashboard__sidebar"
    >
      <header className="dashboard__sidebar-header">
        <AnimatedIcon
          onClick={() => setToggleSidebar(!toggleSidebar)}
          scale={1.1}
          className="dashboard__sidebar-button-toggle"
          icon={
            toggleSidebar ? (
              <TbArrowAutofitContent />
            ) : (
              <TbArrowAutofitContentFilled />
            )
          }
        />
        <Logo
          link={"/dashboard"}
          logoName={!toggleSidebar && "Foodly"}
          className={"dashboard__sidebar-logo"}
        />
      </header>

      <main className="dashboard__sidebar-main">
        {/* <h3>menu</h3> */}
        <ul className="dashboard__sidebar-navlist ">
          {navItems.map(({ icon, name }, i) => {
            return (
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active" : "dashboard__sidebar-navlink"
                }
                to={name}
              >
                <li key={i} className="dashboard__sidebar-navitem">
                  <span className="dashboard__sidebar-icon">{icon}</span>
                  <span className="dashboard__sidebar-text">{name}</span>
                </li>{" "}
              </NavLink>
            );
          })}
        </ul>
      </main>
      <footer>
        {/* <h3>admin settings</h3> */}
        <ul className="dashboard__sidebar-navlist">
          <a href="#d" className="dashboard__sidebar-navlink">
            <li className="dashboard__sidebar-navitem">
              <CiSun className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">settings</span>
            </li>
          </a>
        </ul>
      </footer>
    </motion.div>
  );
}
