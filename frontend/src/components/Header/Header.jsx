import "./Header.css";
import SearchInput from "../Forms/SearchInput";
import UserCart from "../User/UserCart";
import UserHead from "../User/UserHead";
import { NavLink, Link } from "react-router-dom";

import { MdFoodBank } from "react-icons/md";

import driedFruits from "../../assets/icons/dried-fruits.png";
import herb from "../../assets/icons/herb.png";
import oil from "../../assets/icons/oil.png";

export default function Header() {
  const navLinks = [
    { id: 1, name: "dried food", icon: driedFruits },
    { id: 2, name: "oils", icon: oil },
    { id: 3, name: "herbs", icon: herb },
  ];

  const activeStyle = { color: "red" };
  return (
    <header className="header">
      <Link to="/">
        <div className="logo">
          <MdFoodBank className="icon" />
          <span className="logo">FoodLY</span>
        </div>
      </Link>
      <nav className="navbar">
        <ul className="nav__links">
          {navLinks.map(({ id, name, icon }) => {
            console.log(id, name, icon);
            return (
              <li className="nav__item" key={id}>
                <NavLink
                  to={`/${name.replace(" ", "-")}`}
                  className="nav__link"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <img src={icon} alt="icon" className="nav__icon" />
                  <span>{name === "" ? "home" : name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="board__links">
          <SearchInput />
          <UserCart />
          <UserHead />
        </div>
      </nav>
    </header>
  );
}
