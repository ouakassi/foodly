import LoadingSpinner from "../Forms/LoadingSpinner";
import "./PageLoader.css";

export default function PageLoader() {
  return (
    <div className="page-loader">
      <LoadingSpinner style={{ width: "3rem", height: "3rem" }} />
    </div>
  );
}
