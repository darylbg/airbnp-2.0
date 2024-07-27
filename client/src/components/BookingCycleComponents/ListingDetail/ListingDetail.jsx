import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import LoginRegisterComponent from "../../LoginRegisterComponents/LoginRegisterComponent";
import "./ListingDetail.css";
import { setBookingDetails } from "../../../reducers/bookingReducer";

export default function ListingDetail() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const listing = useSelector(
    (state) => state.bookingCycle.booking.listingDetail
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLoginRequiredPrompt, setShowLoginRequiredPrompt] = useState(false);
  
const handleReduxCheckout = () => {
  dispatch(setBookingDetails({listing: listing, numberOfPeople: 2, arrivalTime: 1245, specialRequests: "go fuck yourself"}))
}

  const handleProceedToCheckout = () => {
    if (isLoggedIn) {
      handleReduxCheckout();
      navigate("/checkout");
    } else {
      console.log("please log in");
      setShowLoginRequiredPrompt(true);
    }
  };

  const handleLoginToCheckout = () => {
    console.log("login to checkout")
    handleReduxCheckout();
    navigate("/checkout");
  }

  return (
    <>
      <div className="listing-booking-content">
        <div className="listing-details">details</div>
        <div className="booking-info">
          booking info
          <button onClick={handleProceedToCheckout}>checkout</button>
          {showLoginRequiredPrompt && <LoginRegisterComponent handleLoginToCheckout={handleLoginToCheckout} />}
        </div>
      </div>
    </>
  );
}
