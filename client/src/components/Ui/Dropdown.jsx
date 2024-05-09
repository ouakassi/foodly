import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineDeleteForever } from "react-icons/md";
import "./Dropdown.css"; // Assuming you have CSS styles for the dropdown
import {
  TbCategory2,
  TbCircleArrowDownFilled,
  TbCircleArrowUpFilled,
} from "react-icons/tb";

const Dropdown = ({
  options,
  selectedItem,
  onSelect,
  onDelete,
  defaultLabel,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

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

  return (
    <div className="dropdown__holder">
      <div className="dropdown">
        <div className="dropdown__title" onClick={handleShowDropdown}>
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
            className="dropdown__list"
          >
            {options.map(({ label, value }, i) => (
              <li key={i} onClick={() => handleDropdownItem(value)}>
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
      {onDelete && (
        <motion.span
          whileTap={{ scale: 0.8 }}
          onClick={handleDropdownDelete}
          className="delete__button"
        >
          <MdOutlineDeleteForever />
        </motion.span>
      )}
    </div>
  );
};

export default Dropdown;
