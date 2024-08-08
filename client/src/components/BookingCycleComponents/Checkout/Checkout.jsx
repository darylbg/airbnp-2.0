import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  setBookingDetails,
  resetBooking,
} from "../../../reducers/bookingReducer";
// import CheckoutForm from "./CheckoutForm/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { CREATE_CHECKOUT_SESSION } from "../../../utils/mutations";

const stripePromise = loadStripe("pk_test_doIfqdnODmzgg00kfQcj9wHj00ld9K3l0D");

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

  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_SESSION);

  const handleCheckout = async () => {
    const { data } = await createCheckoutSession({
      variables: { amount: 5000, productName: 'Test Product' }, // Amount in cents, e.g., $50.00
    });

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: data.createCheckoutSession.id });

    if (error) {
      console.error('Error redirecting to Checkout:', error);
    }
  };

  return (
    <div>
      Checkout: {listing?.listing_title}
      <button onClick={handleBack}>Back to Search</button>
      <div>
      <button onClick={handleCheckout}>Checkout</button>
        {/* <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div> */}
      </div>
    </div>
  );
}
