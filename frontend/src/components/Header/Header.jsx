import "./Header.css";
import SearchInput from "../Forms/SearchInput";
import UserCart from "../User/UserCart";
import UserHead from "../User/UserHead";

import { GiChefToque, GiFruitBowl } from "react-icons/gi";
import { TbBottle } from "react-icons/tb";
import { AiFillCloseCircle } from "react-icons/ai";
import { GiHerbsBundle } from "react-icons/gi";
import { BsSearch } from "react-icons/bs";

import { NavLink, Link } from "react-router-dom";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCheckIfClickedOutside from "../../utils/useCheckIfClickedOutside";

export default function Header() {
  const [isSearchButtonClicked, setisSearchButtonClicked] = useState(false);

  const searchRef = useRef();

  const navLinks = [
    { id: 1, name: "dried food", icon: <GiFruitBowl /> },
    { id: 2, name: "oils", icon: <TbBottle /> },
    { id: 3, name: "herbs", icon: <GiHerbsBundle /> },
  ];

  const activeStyle = {
    color: "var(--color-3) ",
    backgroundColor: "var(--color-1)",
  };

  const searchAnimation = {
    hidden: { opacity: 0, y: -50, transition: { duration: 2 } },
    opened: { opacity: 1, y: 0 },
  };

  useCheckIfClickedOutside(
    isSearchButtonClicked,
    setisSearchButtonClicked,
    searchRef
  );

  return (
    <header className="header">
      <nav className="navbar">
        <AnimatePresence>
          <Link className="logo" to="/">
            <GiChefToque className="icon" />
            <span>FoodLY</span>
          </Link>
          {!isSearchButtonClicked && (
            <motion.ul
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="nav__links"
            >
              {navLinks.map(({ id, name, icon }) => {
                return (
                  <li className="nav__item" key={id}>
                    <NavLink
                      to={`/${name.replace(" ", "-")}`}
                      className="nav__link"
                      style={({ isActive }) =>
                        isActive ? activeStyle : undefined
                      }
                    >
                      {icon}
                      <span>{name === "" ? "home" : name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </motion.ul>
          )}
          {isSearchButtonClicked && (
            <motion.div
              variants={searchAnimation}
              initial="hidden"
              animate="opened"
              exit="hidden"
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
          )}{" "}
          {console.log(searchRef)}
          <ul className="board__links">
            {!isSearchButtonClicked && (
              <motion.div
                variants={searchAnimation}
                initial="hidden"
                animate="opened"
                exit="hidden"
                onClick={() => setisSearchButtonClicked(!isSearchButtonClicked)}
                className="search__item"
              >
                <BsSearch />
              </motion.div>
            )}

            <UserCart />
            <UserHead />
          </ul>
        </AnimatePresence>
      </nav>
    </header>
  );
}
