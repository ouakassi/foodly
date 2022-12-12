import "./ShippingBannerBox.css";

export default function ShippingBannerBox({ icon, text }) {
  return (
    <div className="shipping__banner-box">
      <span className="shipping__banner-icon">{icon}</span>
      <p className="shipping__banner-text">{text}</p>
    </div>
  );
}
