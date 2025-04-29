import { RiArrowUpDownLine } from "react-icons/ri";
import "./ProductHeader.css";
import { Link, useSearchParams } from "react-router-dom";

const ProductHeader = ({ headers }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortedBy = searchParams.get("sort");

  return (
    <tr className="table-header">
      {headers.map(({ title, icon, isSortable, value }, index) =>
        isSortable ? (
          <th key={index} className="cell">
            {/* <span style={{ color: "var(--color-3)" }}>{icon}</span> */}
            <button
              className={`sort-button ${
                sortedBy === value ? "active-sort" : ""
              }`}
              onClick={() => {
                // setCurrentPage(1);
                // Always reset the 'status' param and 'page'
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("sort", value);
                setSearchParams(newSearchParams);
              }}
            >
              {title}
              {<RiArrowUpDownLine />}
            </button>
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
