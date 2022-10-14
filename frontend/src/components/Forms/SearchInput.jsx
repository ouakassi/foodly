import "./SearchInput.css";
import { FiSearch } from "react-icons/fi";

export default function SearchInput() {
  return (
    <div className="search-bar">
      <input
        type="search"
        name="search"
        id="site-search"
        placeholder="Search"
      />
      <FiSearch className="icon" />
    </div>
  );
}
