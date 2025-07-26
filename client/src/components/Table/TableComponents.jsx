import { MdOutlineErrorOutline } from "react-icons/md";
import styles from "./TableComponents.module.css";
import { LiaRedoAltSolid } from "react-icons/lia";
import CustomButtom from "@/components/Buttons/CustomButton";

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

const NoDataFound = ({
  message = "No Data found.",
  onClick,
  btnText = "Reset Filters",
  className = "",
  columnsCount = 1,
}) => {
  return (
    <tr>
      <td
        colSpan={columnsCount}
        className={`${styles.noDataFound} ${className}`}
      >
        <span>
          <p>
            <MdOutlineErrorOutline />
            {message}
          </p>
          {
            <CustomButtom
              icon={<LiaRedoAltSolid />}
              style={{ width: "fit-content" }}
              text={btnText}
              onClick={onClick}
            />
          }
        </span>
      </td>
    </tr>
  );
};

export { TableHead, Table, TableBody, TableRow, TableCell, NoDataFound };
