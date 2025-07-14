import "./PageTitle.css";

export default function PageTitle({ icon, title, badge, small }) {
  return (
    <h1 className="page-title" style={small ? { fontSize: "1.2rem" } : null}>
      {icon} {title}
      {badge ? <span className="page-badge">{badge}</span> : null}
    </h1>
  );
}
