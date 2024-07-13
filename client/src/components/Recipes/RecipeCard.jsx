import "./RecipeCard.css";

import { BsBookmark, BsFillBookmarkStarFill } from "react-icons/bs";
import { HiFire } from "react-icons/hi";
import { FaClock } from "react-icons/fa";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Recipe() {
  const [isIconClicked, setIsIconClicked] = useState(false);
  const handleClickedIcon = () => {
    setIsIconClicked(!isIconClicked);
  };
  return (
    <article className="recipe">
      <header>
        <img src="./images/best-strawberry-daiquiri.webp" alt="food" />
        <p>Best Strawberry Daiquiri</p>
      </header>

      <footer>
        <span>
          <FaClock /> 15min
        </span>
        <span>
          <HiFire /> 350 kcal
        </span>
      </footer>
      <motion.span
        whileHover={{ scale: 1.3 }}
        onClick={handleClickedIcon}
        className="recipe-bookmark"
      >
        {isIconClicked ? <BsFillBookmarkStarFill /> : <BsBookmark />}
      </motion.span>
    </article>
  );
}
