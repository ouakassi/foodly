import "./DashboardSidebar.css";
import Logo from "../Navigation/Logo";
import {
  CiMemoPad,
  CiGrid41,
  CiShoppingCart,
  CiMoneyCheck1,
  CiUser,
  CiSun,
  CiSquareChevRight,
  CiSquareChevLeft,
} from "react-icons/ci";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftCollapse,
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
  {
    icon: <CiSun />,
    name: "settings",
  },
];

export default function DashboardSidebar() {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  useEffect(() => {
    const spanElements = document.querySelectorAll(".dashboard__sidebar-text");
    spanElements.forEach(
      (span) => (span.style.display = toggleSidebar ? "none" : "block")
    );
  }, [toggleSidebar]);

  return (
    <motion.div
      initial={false}
      animate={{ width: !toggleSidebar ? "18rem" : "6rem" }}
      className="dashboard__sidebar"
    >
      <header className="dashboard__sidebar-header">
        <AnimatedIcon
          onClick={() => setToggleSidebar(!toggleSidebar)}
          scale={1.2}
          className="dashboard__sidebar-button-toggle"
          // hoverIcon={<BiGridHorizontal />}
          icon={
            toggleSidebar ? (
              <TbLayoutSidebarLeftExpand />
            ) : (
              <TbLayoutSidebarLeftCollapse />
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
                  <motion.span
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="dashboard__sidebar-text"
                  >
                    {name}
                  </motion.span>
                  {toggleSidebar && (
                    <motion.span
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="dashboard__sidebar-tooltip"
                    >
                      {name}
                    </motion.span>
                  )}
                </li>{" "}
              </NavLink>
            );
          })}
        </ul>
      </main>
      {/* <footer>
        <ul className="dashboard__sidebar-navlist">
          <NavLink to={"settings"} className="dashboard__sidebar-navlink">
            <li className="dashboard__sidebar-navitem">
              <CiSun className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">settings</span>
            </li>
          </NavLink>
        </ul>
      </footer> */}
    </motion.div>
  );
}
