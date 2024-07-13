import "./ShippingBannerBox.css";

export default function ShippingBannerBox({ icon, text }) {
  return (
    <div className="shipping-banner-box">
      <span className="shipping-banner-icon">{icon}</span>
      <p className="shipping-banner-text">{text}</p>
    </div>
  );
}
