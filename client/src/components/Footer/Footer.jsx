import { Link } from "react-router-dom";
import Logo from "../Navigation/Logo";
import "./Footer.css";
import FooterList from "./FooterList";

const listOne = ["About", "Store", "FAQ"];
const listTwo = ["Payment", "Delivery", "Contacts"];
const socialLinks = ["store", "about", "same"];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <Logo />
        <p>eco food marketplace</p>
        <br />
        <span className="footer-rights">2022® all rights reserved</span>
      </div>
      <div className="footer-links">
        <FooterList title={"Company"}>
          {listOne.map((link, i) => {
            return (
              <li key={i}>
                <Link className="footer-link" to={link.toLowerCase()}>
                  {link}
                </Link>
              </li>
            );
          })}
        </FooterList>
        <FooterList title={"Services"}>
          {listTwo.map((link, i) => {
            return (
              <li key={i}>
                <Link className="footer-link" to={link.toLowerCase()}>
                  {link}
                </Link>
              </li>
            );
          })}
        </FooterList>
      </div>
    </footer>
  );
}
