import "./PageTitle.css";

export default function PageTitle({ icon, title }) {
  return (
    <h1 className="page-title">
      {icon} {title}
    </h1>
  );
}
