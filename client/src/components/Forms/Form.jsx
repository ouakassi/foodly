import "./Form.css";

export default function Form({ className, onSubmit, children, style }) {
  return (
    <form style={style} className={`form ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
