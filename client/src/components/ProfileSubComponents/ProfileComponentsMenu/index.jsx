import React from "react";
import { Link } from "react-router-dom";

import "./ProfileComponentsMenu.css";

export default function ProfileComponentsMenu() {
  return (
    <ul className="profile-menu-cards">
      <li>
        <Link to="personal-info" className="profile-menu-card">
          <span class="material-symbols-outlined">id_card</span>
          <h2>Personal Info</h2>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="login-and-security" className="profile-menu-card">
        <span class="material-symbols-outlined">
security
</span>          <h2>Login and Security</h2>
          <p>Update your login and security details</p>
        </Link>
      </li>
      <li>
        <Link to="booking-history" className="profile-menu-card">
        <span class="material-symbols-outlined">history</span>
          <h2>Booking History</h2>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="payment-info" className="profile-menu-card">
        <span class="material-symbols-outlined">credit_card</span>
          <h2>Payment Info</h2>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="privacy-policy" className="profile-menu-card">
        <span class="material-symbols-outlined">policy</span>
          <h2>Privacy Policy</h2>
          <p>Update your personal details</p>
        </Link>
      </li>
      <li>
        <Link to="terms-and-conditions" className="profile-menu-card">
        <span class="material-symbols-outlined">receipt_long</span>
          <h2>Terms and Conditions</h2>
          <p>Update your personal details</p>
        </Link>
      </li>
    </ul>
  );
}
