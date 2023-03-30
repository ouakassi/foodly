import "./ProductSkeleton.css";

export default function ProductSkeleton() {
  return (
    <div className="loading__card">
      <div className="loading__card-img"></div>
      <div className="loading__card-content">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
