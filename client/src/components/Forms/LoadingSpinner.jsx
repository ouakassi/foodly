import "./LoadingSpinner.css";

export default function LoadingSpinner({ height, width }) {
  return (
    <span style={{ height: height, width: width }} className="loader"></span>
  );
}
