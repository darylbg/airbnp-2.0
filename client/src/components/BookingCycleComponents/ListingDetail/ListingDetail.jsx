import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import LoginRequiredPrompt from "../../LoginRequiredPrompt/LoginRequiredPrompt";
import "./ListingDetail.css";

export default function ListingDetail() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const listing = useSelector(
    (state) => state.bookingCycle.booking.listingDetail
  );
  const navigate = useNavigate();
  const [showLoginRequiredPrompt, setShowLoginRequiredPrompt] = useState(false);
  const handleProceedToCheckout = () => {
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      console.log("please log in");
      setShowLoginRequiredPrompt(true);
    }
  };

  return (
    <>
      <div className="listing-booking-content">
        <div className="listing-details">details</div>
        <div className="booking-info">
          booking info
          <button onClick={handleProceedToCheckout}>checkout</button>
        </div>
      </div>
      {showLoginRequiredPrompt && <LoginRequiredPrompt />}
    </>
  );
}
