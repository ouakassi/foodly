import "./UserHead.css";

import { FiUser } from "react-icons/fi";
import { FaAngleUp, FaUser } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";

import { Link } from "react-router-dom";
import DropdownMenu from "../Header/DropdownMenu";
import DropdownItem from "../Header/DropdownItem";
import useCheckIfClickedOutside from "../../utils/useCheckIfClickedOutside";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const data = [
  { id: 1, icon: <GoSignOut />, text: "blabla" },
  { id: 2, icon: <GoSignOut />, text: "blabla" },
  { id: 3, icon: <GoSignOut />, text: "blabla" },
];

export default function UserHead() {
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();

  useCheckIfClickedOutside(showMenu, setShowMenu, menuRef);

  const handlClick = () => {
    setShowMenu(!showMenu);
  };

  return (
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
          <DropdownMenu showMenu={showMenu}>
            {data.map(({ id, icon, text }) => {
              return (
                <DropdownItem showMenu={showMenu} key={id} icon={icon}>
                  {text}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </div>
  );
}
