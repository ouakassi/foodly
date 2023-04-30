import { useLocation, Link } from "react-router-dom";
import "./Breadcrumbs.css";
import { HiHome } from "react-icons/hi";
export default function Breadcrumbs() {
  const location = useLocation();

  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `/${crumb}`;

      return (
        <div className="crumb" key={crumb}>
          <Link to={currentLink}>
            {crumb === "dashboard" ? <HiHome /> : crumb}
          </Link>
        </div>
      );
    });

  return <div className="breadcrumbs">{crumbs}</div>;
}
