import "./SearchInput.css";
import { FiSearch } from "react-icons/fi";
import { GoSignOut } from "react-icons/go";
import { BsBackspaceReverseFill } from "react-icons/bs";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import DropdownMenu from "../Navigation/DropdownMenu";
import { useEffect } from "react";
import DropdownItem from "../Navigation/DropdownItem";

const data = [
  { id: 1, icon: <GoSignOut />, text: "blabla" },
  { id: 2, icon: <GoSignOut />, text: "blabla" },
  { id: 3, icon: <GoSignOut />, text: "blabla" },
];

export default function SearchInput({ isSearchButtonClicked }) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState("");

  const searchRef = useRef();

  const handleClearButton = () => {
    searchRef.current.value = "";
    setInputText("");
  };

  useEffect(() => {
    isSearchButtonClicked && searchRef.current.focus();
  }, [isSearchButtonClicked]);

  return (
    <motion.div
      onFocus={() => setIsFocused(true)}
      className="search-bar"
      style={isFocused && { width: "calc(100% + 1%)" }}
    >
      <FiSearch className="search__icon icon" />
      <motion.input
        type="search"
        name="search"
        id="site-search"
        placeholder="Search..."
        onChange={() => {
          setInputText(searchRef.current.value);
        }}
        ref={searchRef}
      />
      <motion.span
        className="search__input-clear"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <BsBackspaceReverseFill onClick={handleClearButton} className="icon" />
      </motion.span>

      <DropdownMenu
        style={{
          width: "100%",
          right: "unset",

          alignItems: "flex-start",
        }}
      >
        {inputText.length === 0 ? (
          <span style={{ color: "var(--color-2)" }}>
            search for any product...
          </span>
        ) : (
          <DropdownItem>{inputText}</DropdownItem>
        )}
      </DropdownMenu>
    </motion.div>
  );
}
