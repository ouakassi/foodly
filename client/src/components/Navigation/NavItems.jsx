import { motion } from "framer-motion";
import { NavLink, Link } from "react-router-dom";

import { GiKiwiFruit, GiCoffeeBeans, GiHerbsBundle } from "react-icons/gi";
import { TbBottle } from "react-icons/tb";
import { AiTwotoneFire } from "react-icons/ai";
import { FaStore } from "react-icons/fa";

const navLinks = [
  { id: 1, name: "store", icon: <FaStore /> },
  { id: 2, name: "nuts", icon: <GiKiwiFruit /> },
  { id: 3, name: "oils", icon: <TbBottle /> },
  { id: 4, name: "herbs", icon: <GiHerbsBundle /> },
  { id: 5, name: "coffee", icon: <GiCoffeeBeans /> },
  { id: 6, name: "sale", icon: <AiTwotoneFire />, color: "var(--color-2)" },
  { id: 7, name: "about" },
];

const navLinksAnimation = {
  closed: { y: 50, opacity: 0 },
  open: { y: 0, opacity: 1 },
};

export default function NavItems({
  isMobile,
  isSidebarButtonClicked,
  updateIsSidebarClicked,
}) {
  return (
    <motion.ul
      variants={navLinksAnimation}
      initial="closed"
      animate="open"
      className="nav__links"
      style={
        isMobile && isSidebarButtonClicked
          ? {
              left: "0",
              boxShadow: "rgb(0 0 0 / 0.2) 0px 0px 0px 50vw",
            }
          : (isMobile && !isSidebarButtonClicked) ||
            (!isMobile && !isSidebarButtonClicked)
          ? { left: "-100%", boxShadow: "none" }
          : null
      }
    >
      {navLinks.map(({ id, name, icon, color }) => {
        const isSale = name === "sale";
        return (
          <li
            className="nav__item"
            key={id}
            onClick={() => updateIsSidebarClicked(false)}
          >
            <NavLink to={`/${name.replace(" ", "-")}`}>
              {({ isActive }) => (
                <div
                  style={
                    isSale && !isActive
                      ? { backgroundColor: color, color: "#fff" }
                      : null
                  }
                  className={`nav__link ${
                    isActive && !isSale
                      ? "nav__link-active"
                      : isActive && isSale
                      ? "nav__link-active-sale"
                      : ""
                  }`}
                >
                  <span>{icon}</span>
                  <span>{name}</span>
                </div>
              )}
            </NavLink>
          </li>
        );
      })}
    </motion.ul>
  );
}
