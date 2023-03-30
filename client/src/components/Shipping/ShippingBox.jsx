import "./ShippingBox.css";

export default function ShippingBox({
  img,
  text,
  title,
  style,
  shippingNumber,
}) {
  return (
    <div style={style} className="shipping__box">
      <div className="shipping__img">
        <img src={img} alt={title} />
      </div>
      <div className="shipping__data">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <span className="shipping__number">{shippingNumber}</span>
    </div>
  );
}
