import "./Section.css";
import { BsArrowReturnRight } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Section({
  style,
  icon,
  text,
  link,
  children,
  sectionClass,
}) {
  return (
    <section style={style} className={`section section__more ${sectionClass}`}>
      <h1>
        {icon}
        {text}
      </h1>
      {children}
      <Link to={link} className="section__view-all">
        <span>
          view all
          <BsArrowReturnRight className="section__more-icon icon" />
        </span>
      </Link>
    </section>
  );
}
