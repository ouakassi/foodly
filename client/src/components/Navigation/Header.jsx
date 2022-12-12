import "./Header.css";
import SearchInput from "../Forms/SearchInput";
import UserCart from "../User/UserCart";
import UserHead from "../User/UserHead";

import { GiKiwiFruit, GiCoffeeBeans } from "react-icons/gi";

import { TbBottle } from "react-icons/tb";
import {
  AiFillCloseCircle,
  AiOutlineAlignLeft,
  AiTwotoneFire,
} from "react-icons/ai";
import { GiHerbsBundle } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { FaStore } from "react-icons/fa";

import Logo from "./Logo";

import { NavLink, Link } from "react-router-dom";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useLayoutEffect } from "react";

const navLinks = [
  { id: 1, name: "store", icon: <FaStore /> },
  { id: 2, name: "nuts", icon: <GiKiwiFruit /> },
  { id: 3, name: "oils", icon: <TbBottle /> },
  { id: 4, name: "herbs", icon: <GiHerbsBundle /> },
  { id: 5, name: "coffee", icon: <GiCoffeeBeans /> },
  { id: 6, name: "sale", icon: <AiTwotoneFire />, color: "var(--color-2)" },
];

export default function Header() {
  const [isSearchButtonClicked, setisSearchButtonClicked] = useState(false);
  const [isSidebarButtonClicked, setisSidebarButtonClicked] = useState(false);

  const searchRef = useRef();
  const sidebarRef = useRef();

  const isMobile = useMediaQuery("(max-width: 820px)");

  const navLinksAnimation = {
    closed: { y: 50, opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  useCheckIfClickedOutside(
    isSearchButtonClicked,
    setisSearchButtonClicked,
    searchRef
  );

  useCheckIfClickedOutside(
    isSidebarButtonClicked,
    setisSidebarButtonClicked,
    sidebarRef
  );

  useLayoutEffect(() => {
    !isMobile && setisSidebarButtonClicked(false);
  }, [isMobile, isSidebarButtonClicked]);

  return (
    <header className="header">
      <nav className="navbar">
        <div style={{ display: "flex" }}>
          {isMobile && (
            <span
              onClick={() => setisSidebarButtonClicked(!isSidebarButtonClicked)}
              className="nav__items-icon"
            >
              <AiOutlineAlignLeft className="icon" />
            </span>
          )}{" "}
          <Logo />
        </div>

        {isSidebarButtonClicked || !isSearchButtonClicked ? (
          <motion.ul
            layout
            ref={sidebarRef}
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
                  onClick={() => setisSidebarButtonClicked(false)}
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
        ) : null}
        {isSearchButtonClicked && (
          <motion.div
            variants={navLinksAnimation}
            initial="closed"
            animate="open"
            // exit="closed"
            className="search__bar__container"
            ref={searchRef}
          >
            <SearchInput isSearchButtonClicked={isSearchButtonClicked} />
            <motion.span
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.3 }}
              className="search__close__icon"
              onClick={() => setisSearchButtonClicked(!isSearchButtonClicked)}
            >
              <AiFillCloseCircle className="icon" />
            </motion.span>
          </motion.div>
        )}
        <ul className="board__links">
          <div
            onClick={() => setisSearchButtonClicked(!isSearchButtonClicked)}
            className="search__item"
          >
            <FiSearch />
          </div>

          <UserCart />
          <UserHead />
        </ul>
      </nav>
    </header>
  );
}
