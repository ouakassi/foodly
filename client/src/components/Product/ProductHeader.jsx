import "./ProductHeader.css";

const ProductHeader = ({ headers }) => {
  return (
    <div className="table-header">
      {headers.map(({ title, icon }, index) => (
        <div key={index} className="cell">
          {icon} {title}
        </div>
      ))}
    </div>
  );
};

export default ProductHeader;
