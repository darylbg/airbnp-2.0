import React from "react";
import "./Footer.css";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import Logo from "../../assets/images/logo_colour_100px.png";
export default function Footer() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="page-footer">
      <div className="footer-links">
        <div className="footer-links-menu">
          <h2 className="footer-links-title">Menu</h2>
          <ul>
            <li className="footer-link-item">
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink to="/search">Search</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink to="/about">About</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink to="/contact">Help center</NavLink>
            </li>
            {isLoggedIn && (
              <>
                <li className="footer-link-item">
                  <NavLink to="/account">Account</NavLink>
                </li>
                <li className="footer-link-item">
                  <NavLink to="/dashboard/bookings">Dashboard</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="footer-links-legal">
          <h2 className="footer-links-title">Legal</h2>
          <ul>
            <li className="footer-link-item">
              <NavLink>Terms and Conditions</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink>Privacy policy</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink>Manage cookies</NavLink>
            </li>
          </ul>
        </div>
        <div className="footer-links-social">
          <h2 className="footer-links-title">Follow</h2>
          <ul>
            <li className="footer-link-item">
              <NavLink>Twitter</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink>Facebook</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink>Instagram</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink>LinkedIn</NavLink>
            </li>
            <li className="footer-link-item">
              <NavLink>TikTok</NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-branding">
        <img src={Logo} className="logo" />
        <span className="brand">AIRBNP</span>
      </div>
      <div className="footer-footer">
        <ButtonComponent
          action={scrollToTop}
          className="default-button page-footer-button"
        >
          Back to top
        </ButtonComponent>
      </div>
    </div>
  );
}
