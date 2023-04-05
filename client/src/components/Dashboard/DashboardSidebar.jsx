import "./DashboardSidebar.css";
import Logo from "../Navigation/Logo";
import {
  CiMemoPad,
  CiGrid41,
  CiShoppingCart,
  CiMoneyCheck1,
  CiUser,
  CiSun,
  CiReceipt,
  CiMenuBurger,
} from "react-icons/ci";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useState } from "react";

export default function DashboardSidebar() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  return (
    <div className="dashboard__sidebar">
      <button onClick={() => {}} className="dashboard__sidebar-button-toggle">
        <BsArrowLeftCircle />
      </button>
      <header className="dashboard__sidebar-header">
        <Logo
          link={"/dashboard"}
          //   logoName={"Foodly"}
          className={"dashboard__sidebar-logo"}
        />
      </header>

      <main className="dashboard__sidebar-main">
        <h3>menu</h3>
        <ul className="dashboard__sidebar-navlist ">
          <li className="dashboard__sidebar-navitem active">
            <a href="#d" className="dashboard__sidebar-navlink ">
              <CiGrid41 className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">overview</span>
            </a>
          </li>
          <li className="dashboard__sidebar-navitem">
            <a href="#d" className="dashboard__sidebar-navlink">
              <CiMoneyCheck1 className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">orders</span>
            </a>
          </li>
          <li className="dashboard__sidebar-navitem">
            <a href="#d" className="dashboard__sidebar-navlink">
              <CiUser className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">custumers</span>
            </a>
          </li>
          <li className="dashboard__sidebar-navitem">
            <a href="#d" className="dashboard__sidebar-navlink">
              <CiShoppingCart className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">products</span>
            </a>
          </li>

          <li className="dashboard__sidebar-navitem">
            <a href="#d" className="dashboard__sidebar-navlink">
              <CiMemoPad className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">reports</span>
            </a>
          </li>
        </ul>
      </main>
      <footer>
        <h3>admin settings</h3>
        <ul className="dashboard__sidebar-navlist">
          <li className="dashboard__sidebar-navitem">
            <a href="#d" className="dashboard__sidebar-navlink">
              <CiSun className="dashboard__sidebar-icon" />
              <span className="dashboard__sidebar-text">settings</span>
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
