import "./Header.css";
export default function Header({ title, button }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {button && button}
    </header>
  );
}
