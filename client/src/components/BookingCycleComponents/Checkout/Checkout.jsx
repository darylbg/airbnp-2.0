import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  setBookingDetails,
  resetBooking,
} from "../../../reducers/bookingReducer";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import "./Checkout.css";
import { Elements } from "@stripe/react-stripe-js";
import WindowControlButton from "../../PrimitiveComponents/WindowControlButton/WindowControlButton";

const stripePromise = loadStripe("pk_test_doIfqdnODmzgg00kfQcj9wHj00ld9K3l0D");

export default function Checkout() {
  const listing = useSelector(
    (state) => state.bookingCycle.booking.bookingDetails?.listing
  );
  const numberOfPeople = useSelector(
    (state) => state.bookingCycle.booking.bookingDetails?.numberOfPeople
  );
  const listingPricing = useSelector(
    (state) => state.bookingCycle.booking.bookingDetails?.pricing
  );
  console.log("listingPrice discount", listingPricing.totalPromos.discount);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [feeInfoDialog, setFeeInfoDialog] = useState(false);

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
    <Elements stripe={stripePromise}>
      <div className="checkout-page">
        <div className="checkout-page-header">
          <h1>Checkout</h1>
        </div>
        <div className="checkout-page-body">
          <div className="back-button">
            <WindowControlButton icon="arrow_back" action={handleBack} />
            <span>Back to Search</span>
          </div>
          <div className="content">
            <div className="checkout-listing">
              <card className="checkout-listing-card">
                <img src={listing?.listing_image[0]} alt="" />
                <div className="checkout-listing-card-text">
                  <div className="header">
                    <h3 className="title">{listing?.listing_title}</h3>
                    <div className="rating">
                      <span class="material-symbols-outlined">star</span>
                      <span>4.8</span>
                    </div>
                  </div>
                  <div className="body">
                    <span className="description">
                      {listing?.listing_description}
                    </span>
                    <h3 className="price">{listing?.price}</h3>
                  </div>
                </div>
              </card>
            </div>
            <div className="checkout-form">
              <div className="booking-price-details">
                <div className="booking-detail-subheader">
                  <h3>Price Details</h3>
                </div>
                <div className="price-detail-breakdown">
                  <div className="price-detail price-calc">
                    <div className="content-left">
                      <span className="text-2">
                        {numberOfPeople} people at £{listingPricing.basePrice}
                        /per person
                      </span>
                    </div>
                    <div className="content-right">
                      <span className="text-2">
                        £{numberOfPeople * listingPricing.basePrice}
                      </span>
                    </div>
                  </div>
                  <div className="price-detail price-fees">
                    <div className="content-left">
                      <span className="text-2">Fees</span>
                      <button
                        onClick={() => setFeeInfoDialog(true)}
                        className="material-symbols-outlined"
                      >
                        info
                      </button>
                    </div>
                    <div className="content-right">
                      <span className="text-2">
                        £
                        {listingPricing.totalFees}
                      </span>
                    </div>
                    <DialogComponent
                      className="fee-info-dialog content-width-dialog"
                      backdropClosable={true}
                      icon="close"
                      dialogHeader="Fees"
                      dialogState={feeInfoDialog}
                      closeDialog={() => setFeeInfoDialog(false)}
                    >
                      <div className="fee-info-dialog-body">
                        <p>This helps us provide services like 24/7 support.</p>
                        <ButtonComponent
                          action={() => setFeeInfoDialog(false)}
                          className="fee-info-dialog-button default-button primary-button"
                        >
                          OK
                        </ButtonComponent>
                      </div>
                    </DialogComponent>
                  </div>
                  {listingPricing.totalPromos.discount !== 0 ? (
                    <div className="price-detail price-applied-promo">
                      <div className="content-left">
                        <span className="text-2">Promo</span>
                        <span className="text-2">
                          {listingPricing.totalPromos?.name}
                        </span>
                      </div>
                      <div className="content-right">
                        <span className="text-2">
                          -£
                          {listingPricing.totalPromos.discount || ""}
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <div className="price-detail price-total">
                    <div className="content-left">
                      <h2>Total price</h2>
                    </div>
                    <div className="content-right">
                      <h2>£{listingPricing.totalPrice}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <CheckoutForm
                amount={listingPricing.totalPrice}
                cardElementClasses={{
                  formClass: "custom-checkout-form",
                  baseClass: "card-element-base",
                  completeClass: "card-element-complete",
                  emptyClass: "card-element-empty",
                  focusClass: "card-element-focus",
                  invalidClass: "card-element-invalid",
                  webkitAutofillClass: "card-element-autofill",
                  buttonClass: "my-custom-button",
                  errorClass: "my-error-message",
                  successClass: "my-success-message",
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: "antialiased",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}
