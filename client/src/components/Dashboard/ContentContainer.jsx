import styles from "./ContentContainer.module.css";

export default function ContentContainer({ children, title, className }) {
  return (
    <div className={`${styles.contentContainer} ${className}`}>
      <header>
        <h3>{title}</h3>
      </header>
      {children}
    </div>
  );
}
