import { RiArrowUpDownLine } from "react-icons/ri";
import "./ProductHeader.css";
import { Link } from "react-router-dom";

const ProductHeader = ({ headers }) => {
  return (
    <tr className="table-header">
      {headers.map(({ title, icon, isSortable, value }, index) =>
        isSortable ? (
          <th key={index} className="cell">
            {/* <span style={{ color: "var(--color-3)" }}>{icon}</span> */}
            <Link className="sort-button" to={`?sort=${value}`}>
              {title}
              {<RiArrowUpDownLine />}
            </Link>
          </th>
        ) : (
          <th key={index} className="cell">
            {/* <span style={{ color: "var(--color-3)" }}>{icon}</span> */}
            {title}
          </th>
        )
      )}
    </tr>
  );
};

export default ProductHeader;
