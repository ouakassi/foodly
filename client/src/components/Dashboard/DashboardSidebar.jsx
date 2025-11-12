import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import "./DashboardSidebar.css";
import Logo from "../Navigation/Logo";
import {
  BsClipboardData,
  BsPeople,
  BsClipboardDataFill,
  BsPeopleFill,
  BsClipboardCheckFill,
  BsClipboardCheck,
  BsGridFill,
  BsGrid,
  BsBasket,
  BsBasketFill,
  BsPersonCircle,
  BsPersonGear,
  BsBoxArrowInRight,
  BsPersonVcard,
} from "react-icons/bs";
import AnimatedIcon from "../Buttons/AnimatedIcon";
import DashboardSidebarNavItem from "./DashboardSidebarNavItem";
import DropdownMenu from "../Navigation/DropdownMenu";
import DropdownItem from "../Navigation/DropdownItem";
import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";
import { LuArrowLeftFromLine, LuArrowRightFromLine } from "react-icons/lu";
import { APP_LINKS } from "../../constants";
import { useLogout } from "../../hooks/useLogout";

const navItems = [
  {
    icon: <BsGrid />,
    hoverIcon: <BsGridFill />,
    name: "overview",
    link: APP_LINKS.DASHBOARD_OVERVIEW,
  },
  {
    icon: <BsBasket />,
    hoverIcon: <BsBasketFill />,
    name: "products",
    link: APP_LINKS.PRODUCTS,
  },
  {
    icon: <BsClipboardCheck />,
    hoverIcon: <BsClipboardCheckFill />,
    name: "orders",
    link: APP_LINKS.ORDERS,
  },
  {
    icon: <BsPeople />,
    hoverIcon: <BsPeopleFill />,

    name: "users",
    link: APP_LINKS.USERS,
  },
  {
    icon: <BsClipboardData />,
    hoverIcon: <BsClipboardDataFill />,
    name: "reports",
    link: APP_LINKS.DASHBOARD_REPORTS,
  },
];

export default function DashboardSidebar() {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [toggleAdminPopup, setToggleAdminPopup] = useState(false);

  const adminPopupRef = useRef();
  const sidebarRef = useRef();

  const logout = useLogout();

  useEffect(() => {
    const spanElements = document.querySelectorAll(".dashboard-sidebar-text");
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
      initial={{ x: "-3.75rem", opacity: 0, width: "var(--sidebar-width)" }}
      animate={{
        x: 0,
        opacity: 1,
        width: !toggleSidebar ? "11.5rem" : "var(--sidebar-width)",
      }}
      className="dashboard-sidebar"
    >
      <header className="dashboard-sidebar-header">
        {!toggleSidebar && (
          <Logo
            link={APP_LINKS.DASHBOARD}
            logoName="Foodly"
            className="dashboard-sidebar-logo"
          />
        )}
        <AnimatedIcon
          onClick={() => setToggleSidebar(!toggleSidebar)}
          scale={1.2}
          className="dashboard-sidebar-button-toggle"
          icon={
            toggleSidebar ? <LuArrowRightFromLine /> : <LuArrowLeftFromLine />
          }
        />
      </header>

      <main className="dashboard-sidebar-main">
        <ul className="dashboard-sidebar-navlist ">
          {navItems.map(({ icon, hoverIcon, name, link }, i) => {
            return (
              <NavLink
                key={i}
                style={{
                  padding: toggleSidebar
                    ? "0.75rem 0.75rem"
                    : "0.75rem 1.75rem",
                }}
                className="dashboard-sidebar-navlink"
                onClick={() => setToggleSidebar(true)}
                to={link}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        initial={{ height: "0%", opacity: 0 }}
                        animate={{
                          height: "50%",
                          opacity: 1,
                        }}
                        transition={{ duration: 0.5, damping: 0.8 }}
                        className="tab-active"
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
            padding: toggleSidebar ? "0.75rem 0.75rem" : "0.75rem 1.75rem",
          }}
          onClick={() => setToggleAdminPopup(!toggleAdminPopup)}
          className="dashboard-sidebar-navlink "
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
                style={!toggleSidebar ? { left: "9.5rem" } : null}
                className="dashboard-admin-popup"
              >
                <Link
                  to={"settings/profile"}
                  className="dashboard-admin-popup-link"
                >
                  <DropdownItem icon={<BsPersonVcard />}>
                    <span className="dashboard-admin-popup-name">profile</span>
                  </DropdownItem>
                </Link>
                <Link onClick={logout} className="dashboard-admin-popup-link">
                  <DropdownItem icon={<BsBoxArrowInRight />}>
                    <span className="dashboard-admin-popup-name">logout</span>
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
