import "./FooterList.css";

export default function FooterList({ title, children }) {
  return (
    <div className="footer-list">
      <h3>{title}</h3>
      <ul>{children}</ul>
    </div>
  );
}
