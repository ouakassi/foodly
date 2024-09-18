import "./ProductHeader.css";

const ProductHeader = ({ headers }) => {
  return (
    <tr className="table-header">
      {headers.map(({ title, icon }, index) => (
        <th key={index} className="cell">
          {/* <span style={{ color: "var(--color-3)" }}>{icon}</span> */}
          {title}
        </th>
      ))}
    </tr>
  );
};

export default ProductHeader;
