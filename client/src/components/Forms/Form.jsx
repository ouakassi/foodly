import "./Form.css";

export default function Form({ onSubmit, children, style }) {
  return (
    <form style={style} className="form" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
