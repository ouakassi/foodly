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
    <section
      style={style}
      className={`section section-more ${sectionClass || ""}`}
    >
      <h1>
        {icon}
        {text}
      </h1>
      {children}
      {link && (
        <Link to={link} className="section-view-all">
          <span>
            view all
            <BsArrowReturnRight className="section-more-icon icon" />
          </span>
        </Link>
      )}
    </section>
  );
}
