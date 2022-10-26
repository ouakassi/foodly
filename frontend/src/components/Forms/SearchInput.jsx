import "./SearchInput.css";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import DropdownMenu from "../Header/DropdownMenu";
import { useEffect } from "react";

export default function SearchInput({ isSearchButtonClicked }) {
  const [isFocused, setIsFocused] = useState(false);

  const searchRef = useRef();

  useEffect(() => {
    isSearchButtonClicked && searchRef.current.focus();
  }, [isSearchButtonClicked]);

  return (
    <motion.div
      onFocus={() => setIsFocused(true)}
      className="search-bar"
      layout
      style={isFocused ? { width: "41%" } : { width: "40%" }}
    >
      <FiSearch className="search__icon icon" />
      <motion.input
        type="search"
        name="search"
        id="site-search"
        placeholder="Search..."
        ref={searchRef}
      />
      <DropdownMenu style={{ width: "inherit", right: "unset" }}>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
        <li>hahadsdsdha</li>
      </DropdownMenu>
    </motion.div>
  );
}
