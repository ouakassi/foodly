import "./PageTitle.css";

export default function PageTitle({ icon, title, badge }) {
  return (
    <h1 className="page-title">
      {icon} {title}
      {badge ? <span className="page-badge">{badge}</span> : null}
    </h1>
  );
}
