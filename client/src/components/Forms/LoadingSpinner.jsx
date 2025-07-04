import "./LoadingSpinner.css";

export default function LoadingSpinner({ height, width, borderWidth }) {
  return (
    <span
      style={{ height: height, width: width, borderWidth: borderWidth }}
      className="loader"
    ></span>
  );
}
