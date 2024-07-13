import "./DashboardNavbar.css";
import UserHead from "../User/UserHead";

export default function DashboardNavbar() {
  return (
    <header className="dashboard-navbar">
      <nav>
        <UserHead />
      </nav>
    </header>
  );
}
