import "./UserHead.css";

import { FiUser } from "react-icons/fi";
import { FaAngleUp, FaUser } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import {
  BsFillBookmarkStarFill,
  BsFillBookmarkHeartFill,
} from "react-icons/bs";

import DropdownMenu from "../Navigation/DropdownMenu";
import DropdownItem from "../Navigation/DropdownItem";
import MainButton from "../Buttons/MainButton";

import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const data = [
  { id: 1, icon: <BsFillBookmarkHeartFill />, text: "favourite" },
  { id: 2, icon: <BsFillBookmarkStarFill />, text: "bookmarks" },
  { id: 3, icon: <GoSignOut />, text: "sign out" },
];

const isLogged = false;

export default function UserHead() {
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();

  useCheckIfClickedOutside(showMenu, setShowMenu, menuRef);

  const handlClick = () => {
    setShowMenu(!showMenu);
  };

  return isLogged ? (
    <div
      onClick={handlClick}
      className="user__head"
      ref={menuRef}
      style={showMenu ? { backgroundColor: "var(--background-color1)" } : null}
    >
      <div className="user__head-icons">
        {showMenu ? <FaUser className="icon" /> : <FiUser className="icon" />}
        <span className="user__head-name">user</span>
        <motion.span
          animate={
            showMenu
              ? { transform: "rotate(0deg)" }
              : { transform: "rotate(180deg)" }
          }
        >
          <FaAngleUp />
        </motion.span>
      </div>
      <AnimatePresence>
        {showMenu && (
          <DropdownMenu>
            {data.map(({ id, icon, text }) => {
              return (
                <DropdownItem key={id} icon={icon}>
                  {text}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <MainButton text="login" link="login" style={{ padding: "1rem 2rem" }} />
  );
}
