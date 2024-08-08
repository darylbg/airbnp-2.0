import React, { useCallback } from "react";
import { useMutation, gql } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { CREATE_CHECKOUT_SESSION } from "../../../../utils/mutations";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_doIfqdnODmzgg00kfQcj9wHj00ld9K3l0D");


const CheckoutForm = () => {
  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_SESSION);

  const fetchClientSecret = useCallback(async () => {
    const { data } = await createCheckoutSession({ variables: { priceId: "{{PRICE_ID}}" } });
    return data.createCheckoutSession.clientSecret;
  }, [createCheckoutSession]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
