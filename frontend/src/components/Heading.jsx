import "./Heading.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Heading({ icon, text, link }) {
  return (
    <div className="heading">
      <h1>
        {icon}
        {text}
      </h1>
      <Link to={link}>
        <span>
          view all
          <AiOutlineArrowRight className="icon" />
        </span>
      </Link>
    </div>
  );
}
