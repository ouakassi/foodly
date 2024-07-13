import { Link, useLocation } from "react-router-dom";

import "./PageHeader.css";
import Breadcrumbs from "../Navigation/Breadcrumbs";

export default function PageHeader({ header }) {
  const location = useLocation();
  console.log(location);
  return (
    <div className="page-header">
      <h1>{header}</h1>
      <Breadcrumbs />
    </div>
  );
}
