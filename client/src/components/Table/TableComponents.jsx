import styles from "./TableComponents.module.css";

function Table({ children, className = "" }) {
  return <table className={`${styles.table} ${className}`}>{children}</table>;
}
function TableHead({ columns = [], className }) {
  return (
    <thead className={`${className} ${styles.tableHead}`}>
      <tr>
        {columns.map((col, index) => (
          <th key={index}>{col}</th>
        ))}
      </tr>
    </thead>
  );
}

function TableBody({ children, className }) {
  return (
    <tbody className={`${className} ${styles.tableBody}`}>{children}</tbody>
  );
}
function TableRow({ children }) {
  return <tr className={styles.tableRow}>{children}</tr>;
}

function TableCell({ children, className = "" }) {
  return <td className={`${styles.tableCell} ${className}`}>{children}</td>;
}

export { TableHead, Table, TableBody, TableRow, TableCell };
