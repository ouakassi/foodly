import "./ProductHeader.css";

const ProductHeader = ({ headers }) => {
  return (
    <div className="table__header">
      {headers.map(({ title, icon }, index) => (
        <div key={index} className="cell">
          {icon} {title}
        </div>
      ))}
    </div>
  );
};

export default ProductHeader;
