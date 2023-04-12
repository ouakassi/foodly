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
  HiOutlineUsers,
  HiOutlineTemplate,
  HiOutlineCash,
  HiOutlineArchive,
  HiOutlineDocumentReport,
  HiMenuAlt2,
  HiMenuAlt3,
} from "react-icons/hi";
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
    icon: <HiOutlineTemplate />,
    // HiTemplate
    name: "overview",
    link: "overview",
  },
  {
    icon: <HiOutlineCash />,
    // HiCash
    name: "orders",
    link: "orders",
  },
  {
    icon: <HiOutlineArchive />,
    // HiArchive
    name: "products",
    link: "products",
  },
  {
    icon: <HiOutlineUsers />,
    // HiUsers
    name: "customers",
    link: "customers",
  },
  {
    icon: <HiOutlineDocumentReport />,
    // HiDocumentReport
    name: "reports",
    link: "reports",
  },

  // {
  //   icon: <CiSun />,
  //   name: "settings",
  //   link: "settings",
  // },
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
    <motion.aside
      initial={{ x: "-6rem", opacity: 0, width: "var(--sidebar-width)" }}
      animate={{
        x: 0,
        opacity: 1,
        width: !toggleSidebar ? "18rem" : "var(--sidebar-width)",
      }}
      // whileInView={{ x: 0, opacity: 1 }}
      className="dashboard__sidebar"
    >
      <header className="dashboard__sidebar-header">
        <AnimatedIcon
          onClick={() => setToggleSidebar(!toggleSidebar)}
          scale={1.2}
          className="dashboard__sidebar-button-toggle"
          // hoverIcon={<BiGridHorizontal />}
          icon={toggleSidebar ? <HiMenuAlt2 /> : <HiMenuAlt3 />}
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
          {navItems.map(({ icon, name, link }, i) => {
            return (
              <NavLink
                className={({ isActive }) =>
                  `dashboard__sidebar-navlink ${isActive && "active"}`
                }
                to={link}
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
    </motion.aside>
  );
}
