import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineDeleteForever } from "react-icons/md";
import "./Dropdown.css"; // Assuming you have CSS styles for the dropdown
import {
  TbCategory2,
  TbCircleArrowDownFilled,
  TbCircleArrowUpFilled,
} from "react-icons/tb";
import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";

const Dropdown = ({
  options,
  selectedItem,
  onSelect,
  onDelete,
  defaultLabel,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownItem = (label) => {
    onSelect(label);
    setShowDropdown(false);
  };

  const handleDropdownDelete = (event) => {
    event.stopPropagation(); // Prevent click propagation to parent elements
    onDelete();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      // Close dropdown when Tab key is pressed
      setShowDropdown(true);
    }
    // setShowDropdown(false);
  };

  useCheckIfClickedOutside(showDropdown, setShowDropdown, dropdownRef);

  return (
    <div className="dropdown-holder">
      <div className="dropdown" ref={dropdownRef}>
        <div
          tabIndex="0"
          className="dropdown-title"
          onClick={handleShowDropdown}
          onKeyDown={handleKeyDown}
        >
          <span>
            <TbCategory2 />
            {!selectedItem ? defaultLabel : selectedItem}
          </span>
          {showDropdown ? (
            <TbCircleArrowUpFilled />
          ) : (
            <TbCircleArrowDownFilled />
          )}
        </div>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="dropdown-list"
          >
            {options.map(({ label, value }, i) => (
              <li
                tabIndex={i + 1}
                key={i}
                onClick={() => handleDropdownItem(value)}
              >
                <a href="#">{label}</a>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
      {onDelete && (
        <motion.span
          whileTap={{ scale: 0.8 }}
          onClick={handleDropdownDelete}
          className="delete-button"
        >
          <MdOutlineDeleteForever />
        </motion.span>
      )}
    </div>
  );
};

export default Dropdown;
