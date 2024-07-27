import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, redirect } from "react-router-dom";
import { setBookingDetails, resetBooking } from "../../../reducers/bookingReducer";

export default function Checkout() {
  const listing = useSelector(
    (state) => state.bookingCycle.booking.bookingDetails?.listing
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (listing && listing.id) {
      const url = new URL(window.location);
      url.searchParams.set("listing", listing.id);
      window.history.pushState({ listingId: listing.id }, "", url);
    } else {
      navigate("/search");
    }
  }, [listing]);

  const handleBack = () => {
    navigate("/search");
    dispatch(setBookingDetails(resetBooking()));
  };

  return (
    <div>
      Checkout: {listing?.listing_title}
      <button onClick={handleBack}>back</button>
    </div>
  );
}
