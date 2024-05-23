import React from "react";
import { Link } from "react-router-dom";

import "./AccountComponentsMenu.css";

export default function AccountComponentsMenu() {
  return (
    <ul className="profile-menu-cards">
      <li>
        <Link to="personal-info" className="profile-menu-card">
          <span className="material-symbols-outlined">id_card</span>
          <h3>Personal Info</h3>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="login-and-security" className="profile-menu-card">
        <span className="material-symbols-outlined">
security
</span>          <h3>Login and Security</h3>
          <p>Update your login and security details</p>
        </Link>
      </li>
      <li>
        <Link to="booking-history" className="profile-menu-card">
        <span className="material-symbols-outlined">history</span>
          <h3>Booking History</h3>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="payment-info" className="profile-menu-card">
        <span className="material-symbols-outlined">credit_card</span>
          <h3>Payment Info</h3>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="privacy-policy" className="profile-menu-card">
        <span className="material-symbols-outlined">policy</span>
          <h3>Privacy Policy</h3>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="terms-and-conditions" className="profile-menu-card">
        <span className="material-symbols-outlined">receipt_long</span>
          <h3>Terms and Conditions</h3>
          <p>Update your personal details</p>
        </Link>
      </li>
    </ul>
  );
}
