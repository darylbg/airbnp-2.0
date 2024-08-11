import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PAYMENT_INTENT } from "../../../../utils/mutations";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetBooking } from "../../../../reducers/bookingReducer";
import ButtonComponent from "../../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import ToastComponent from "../../../PrimitiveComponents/ToastComponent/ToastComponent";
import toast from "react-hot-toast";

const CheckoutForm = ({ amount, onSuccess, cardElementClasses = {} }) => {
  const dispatch = useDispatch();
  const arrivalTime = useSelector(
    (state) => state.bookingCycle.booking.bookingDetails?.arrivalTime
  );

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create PaymentIntent
      setLoading(true);
      const { data } = await createPaymentIntent({
        variables: { amount: amount * 100 },
      });
      const clientSecret = data.createPaymentIntent.clientSecret;

      // Confirm the payment
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setError(error.message);
        setSuccess(false);
        setLoading(false);
      } else {
        setError(null);
        setSuccess(true);
        toast.success(
          <ToastComponent
            message={`Successfully booked! We have let your hosts know you will arrive around ${arrivalTime.hour}:${arrivalTime.minute}.`}
          />
        );
        console.log("Payment successful:", paymentIntent);
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
      setSuccess(false);
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        ...(cardElementClasses.base || {}),
      },
      invalid: {
        color: "#9e2146",
        ...(cardElementClasses.invalid || {}),
      },
    },
    hidePostalCode: true,
    classes: {
      base: cardElementClasses.baseClass || "",
      complete: cardElementClasses.completeClass || "",
      empty: cardElementClasses.emptyClass || "",
      focus: cardElementClasses.focusClass || "",
      invalid: cardElementClasses.invalidClass || "",
      webkitAutofill: cardElementClasses.webkitAutofillClass || "",
    },
  };

  return (
    <form onSubmit={handleSubmit} className={cardElementClasses.formClass}>
      <div className="text-checkout-info">
        <p>This is a dummy test checkout. To checkout, use the following details:</p>
        <ul>
          <li>Card number: 4242 4242 4242 4242</li>
          <li>Card expiry date: *use any date in the future</li>
          <li>Card CVV: *use any 3 numbers</li>
        </ul>
      </div>
      <CardElement options={cardElementOptions} />
      <ButtonComponent
        loading={loading}
        type="submit"
        disabled={!stripe}
        className={`default-button action-button ${cardElementClasses.buttonClass}`}
      >
        {success ? "Payment Successful!" : `Pay £${amount?.toFixed(2)}`}
      </ButtonComponent>
      {error && <div className={cardElementClasses.errorClass}>{error}</div>}
      {success && (
        <div className={cardElementClasses.successClass}>
          <span>Successfully booked! We have let your hosts know you will arrive around {arrivalTime.hour}:{arrivalTime.minute}.</span>
          <span>View your booking <NavLink to="/account/booking-history">here</NavLink>.</span>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
