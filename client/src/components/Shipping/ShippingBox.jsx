import "./ShippingBox.css";

export default function ShippingBox({
  img,
  text,
  title,
  style,
  shippingNumber,
}) {
  return (
    <div style={style} className="shipping-box">
      <div className="shipping-img">
        <img src={img} alt={title} />
      </div>
      <div className="shipping-data">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <span className="shipping-number">{shippingNumber}</span>
    </div>
  );
}
