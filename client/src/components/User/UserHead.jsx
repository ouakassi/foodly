import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";

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
import Button from "../Buttons/Button";
import BlurredModal from "../Navigation/BlurredModal";

const data = [
  { id: 1, icon: <BsFillBookmarkHeartFill />, text: "favourite" },
  { id: 2, icon: <BsFillBookmarkStarFill />, text: "bookmarks" },
  { id: 3, icon: <GoSignOut />, text: "sign out" },
];

export default function UserHead() {
  const [showMenu, setShowMenu] = useState(false);
  const MenuRef = useRef(null);

  const handlClick = () => {
    setShowMenu(!showMenu);
  };

  useCheckIfClickedOutside(showMenu, setShowMenu, MenuRef);

  return (
    <div
      ref={MenuRef}
      onClick={handlClick}
      className="user__head"
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
          <DropdownMenu
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
      <BlurredModal showModal={showMenu} />
    </div>
  );
}
