import "./ProductSkeleton.css";

export default function ProductSkeleton() {
  return (
    <div className="loading-card">
      <div className="loading-card-img"></div>
      <div className="loading-card-content">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
