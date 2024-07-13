import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "./Header.css";
import SearchInput from "../Forms/SearchInput";
import UserCart from "../User/UserCart";
import UserHead from "../User/UserHead";
import NavItems from "./NavItems";
import Logo from "./Logo";

import { RiSearchLine, RiSearchFill } from "react-icons/ri";
import { AiFillCloseCircle, AiOutlineAlignLeft } from "react-icons/ai";

import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";
import useMediaQuery from "../../hooks/useMediaQuery";
import CustomButton from "../Buttons/CustomButton";

export default function Header() {
  const isLogged = false;
  const [isSearchButtonClicked, setisSearchButtonClicked] = useState(false);
  const [isSidebarButtonClicked, setisSidebarButtonClicked] = useState(false);

  const searchRef = useRef();

  const isMobile = useMediaQuery("(max-width: 820px)");

  useCheckIfClickedOutside(
    isSearchButtonClicked,
    setisSearchButtonClicked,
    searchRef
  );

  useLayoutEffect(() => {
    !isMobile && setisSidebarButtonClicked(false);
  }, [isMobile, isSidebarButtonClicked]);

  const updateIsSidebarClicked = useCallback(
    (newIsSidebarClicked) => setisSidebarButtonClicked(newIsSidebarClicked),
    []
  );

  return (
    <header className="nav-header">
      <nav className="navbar">
        <div style={{ display: "flex" }}>
          {isMobile && (
            <span
              onClick={() => setisSidebarButtonClicked(!isSidebarButtonClicked)}
              className="nav-items-icon"
            >
              <AiOutlineAlignLeft className="icon" />
            </span>
          )}{" "}
          <Logo logoName="FoodLY" />
        </div>

        {isSidebarButtonClicked || !isSearchButtonClicked ? (
          <NavItems
            isMobile={isMobile}
            isSidebarButtonClicked={isSidebarButtonClicked}
            updateIsSidebarClicked={updateIsSidebarClicked}
          />
        ) : null}
        {isSearchButtonClicked && (
          <motion.div
            // variants={navLinksAnimation}
            initial="closed"
            animate="open"
            // exit="closed"
            className="search-bar-container"
            ref={searchRef}
          >
            <SearchInput isSearchButtonClicked={isSearchButtonClicked} />
            <motion.span
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.3 }}
              className="search-close-icon"
              onClick={() => setisSearchButtonClicked(!isSearchButtonClicked)}
            >
              <AiFillCloseCircle className="icon" />
            </motion.span>
          </motion.div>
        )}
        <ul className="board-links">
          <div
            onClick={() => setisSearchButtonClicked(!isSearchButtonClicked)}
            className="search-item"
          >
            {!isSearchButtonClicked ? <RiSearchLine /> : <RiSearchFill />}
          </div>

          <UserCart />
          {isLogged ? (
            <UserHead />
          ) : (
            <Link to="auth/login">
              <CustomButton text="login" />
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
}
