import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import "./DashboardSidebar.css";
import Logo from "../Navigation/Logo";
import {
  BsClipboardData,
  BsPeople,
  BsCollection,
  BsArchive,
  BsCollectionFill,
  BsArchiveFill,
  BsClipboardDataFill,
  BsPeopleFill,
  BsClipboardCheckFill,
  BsClipboardCheck,
  BsGridFill,
  BsGrid,
  BsFilterLeft,
  BsFilterRight,
  BsBasket,
  BsBasketFill,
  BsPersonCircle,
  BsPersonGear,
  BsBoxArrowInRight,
  BsPersonVcard,
} from "react-icons/bs";
import { HiMenuAlt2, HiMenuAlt3 } from "react-icons/hi";
import AnimatedIcon from "../Buttons/AnimatedIcon";
import DashboardSidebarNavItem from "./DashboardSidebarNavItem";
import DropdownMenu from "../Navigation/DropdownMenu";
import DropdownItem from "../Navigation/DropdownItem";
import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";

const navItems = [
  {
    icon: <BsGrid />,
    hoverIcon: <BsGridFill />,
    name: "overview",
    link: "overview",
  },
  {
    icon: <BsBasket />,
    hoverIcon: <BsBasketFill />,
    name: "products",
    link: "products",
  },
  {
    icon: <BsClipboardCheck />,
    hoverIcon: <BsClipboardCheckFill />,
    name: "orders",
    link: "orders",
  },
  {
    icon: <BsPeople />,
    hoverIcon: <BsPeopleFill />,

    name: "customers",
    link: "customers",
  },
  {
    icon: <BsClipboardData />,
    hoverIcon: <BsClipboardDataFill />,
    name: "reports",
    link: "reports",
  },
];

export default function DashboardSidebar() {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [toggleAdminPopup, setToggleAdminPopup] = useState(false);

  const adminPopupRef = useRef();
  const sidebarRef = useRef();

  useEffect(() => {
    const spanElements = document.querySelectorAll(".dashboard__sidebar-text");
    spanElements.forEach(
      (span) => (span.style.display = toggleSidebar ? "none" : "block")
    );
  }, [toggleSidebar]);

  useCheckIfClickedOutside(
    toggleAdminPopup,
    setToggleAdminPopup,
    adminPopupRef
  );
  useCheckIfClickedOutside(!toggleSidebar, setToggleSidebar, sidebarRef);

  return (
    <motion.aside
      ref={sidebarRef}
      initial={{ x: "-6rem", opacity: 0, width: "var(--sidebar-width)" }}
      animate={{
        x: 0,
        opacity: 1,
        width: !toggleSidebar ? "18rem" : "var(--sidebar-width)",
      }}
      className="dashboard__sidebar"
    >
      <header className="dashboard__sidebar-header">
        {!toggleSidebar && (
          <Logo
            link="/dashboard"
            logoName="Foodly"
            className="dashboard__sidebar-logo"
          />
        )}
        <AnimatedIcon
          onClick={() => setToggleSidebar(!toggleSidebar)}
          scale={1.2}
          className="dashboard__sidebar-button-toggle"
          icon={toggleSidebar ? <BsFilterLeft /> : <BsFilterRight />}
        />
      </header>

      <main className="dashboard__sidebar-main">
        <ul className="dashboard__sidebar-navlist ">
          {navItems.map(({ icon, hoverIcon, name, link }, i) => {
            return (
              <NavLink
                key={i}
                style={{
                  padding: toggleSidebar ? "1rem 1.5rem" : "1rem 2.5rem",
                }}
                className="dashboard__sidebar-navlink"
                onClick={() => setToggleSidebar(true)}
                to={link}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{
                          x: 0,
                          opacity: 1,
                        }}
                        className="tab__active"
                      ></motion.span>
                    )}
                    <DashboardSidebarNavItem
                      name={name}
                      tooltip={name}
                      icon={icon}
                      hoverIcon={hoverIcon}
                      isActive={isActive}
                      toggleSidebar={toggleSidebar}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </ul>
      </main>
      <footer>
        <div
          ref={adminPopupRef}
          style={{
            padding: toggleSidebar ? "1rem 1.5rem" : "1rem 2.5rem",
          }}
          onClick={() => setToggleAdminPopup(!toggleAdminPopup)}
          className="dashboard__sidebar-navlink "
        >
          <DashboardSidebarNavItem
            icon={<BsPersonGear />}
            hoverIcon={<BsPersonCircle />}
            // toggleSidebar={toggleSidebar}
            name="settings"
            isActive={toggleAdminPopup}
          />
          <AnimatePresence>
            {toggleAdminPopup && (
              <DropdownMenu
                style={!toggleSidebar ? { left: "16rem" } : null}
                className="dashboard__admin-popup"
              >
                <Link
                  to={"settings/profile"}
                  className="dashboard__admin-popup-link"
                >
                  <DropdownItem icon={<BsPersonVcard />}>
                    <span className="dashboard__admin-popup-name">profile</span>
                  </DropdownItem>
                </Link>
                <Link className="dashboard__admin-popup-link">
                  <DropdownItem icon={<BsBoxArrowInRight />}>
                    <span className="dashboard__admin-popup-name">logout</span>
                  </DropdownItem>
                </Link>
              </DropdownMenu>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </motion.aside>
  );
}
