import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBookingDetails } from "../../../reducers/bookingReducer";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import WindowControlButton from "../../PrimitiveComponents/WindowControlButton/WindowControlButton";
import StepProgressBar from "../../PrimitiveComponents/StepProgressBar/StepProgressBar";
import TimePicker from "../../PrimitiveComponents/TimePicker/TimePicker";
import LoginRegisterComponent from "../../LoginRegisterComponents/LoginRegisterComponent";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import "./BookingInfo.css";
import { VALIDATE_TOKEN } from "../../../utils/mutations/urlGenerationMutations";
import { GENERATE_TOKEN } from "../../../utils/queries/urlGenerationQueries";
import { useMutation, useQuery } from "@apollo/client";

export default function BookingInfo({
  routeType,
  arrivalTime,
  setArrivalTime,
  handleRouteTypeSwitch,
  formattedRouteData,
}) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const listing = useSelector(
    (state) => state.bookingCycle.booking.listingDetail?.listing
  );

  const userLocation = useSelector((state) => state.bookingCycle.userLocation);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLoginRequiredPrompt, setShowLoginRequiredPrompt] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [addPromoCode, setAddPromoCode] = useState(false);
  const [promoMessage, setPromoMessage] = useState("Use code 20%OFF");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [feePercentage, setFeePercentage] = useState(0.1);

  const [feeInfoDialog, setFeeInfoDialog] = useState(false);

  const basePrice = listing?.price || 0;
  const promoCodeDiscount = appliedPromoCode === "20%OFF" ? 0.2 : 0;

  const [pricingDetails, setPricingDetails] = useState({
    basePrice: 0.00,
    totalFees: 0.00,
    totalPromos: {
      name: "",
      discount: 0.00,
    },
    totalPrice: 0.00,
  });
  console.log(pricingDetails);

  useEffect(() => {
    if (listing?.price) {
      setPricingDetails((prevDetails) => ({
        ...prevDetails,
        basePrice: listing.price,
      }));
    }
  }, [listing]);

  useEffect(() => {
    const calculatePricingDetails = () => {
      const subtotal = numberOfPeople * basePrice;
      const fees = subtotal * feePercentage;
      const discount = subtotal * promoCodeDiscount;
      const totalPrice = subtotal + fees - discount;
      setPricingDetails({
        basePrice: basePrice,
        totalFees: fees,
        totalPromos: {
          name: appliedPromoCode,
          discount: discount,
        },
        totalPrice: totalPrice,
      });
      
    };

    calculatePricingDetails();
  }, [
    numberOfPeople,
    feePercentage,
    promoCodeDiscount,
    appliedPromoCode,
    basePrice,
  ]);

  // Increment and decrement number of people booking for
  const incrementNumberOfPeople = () => {
    if (numberOfPeople < 10) setNumberOfPeople(numberOfPeople + 1);
  };

  const decrementNumberOfPeople = () => {
    if (numberOfPeople > 1) setNumberOfPeople(numberOfPeople - 1);
  };

  const progressSteps = [
    { step: 1, title: "Select listing" },
    { step: 2, title: "Booking info" },
    { step: 3, title: "Payment" },
  ];

  // Initialize arrival time
  useEffect(() => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 20 * 60000);
    setArrivalTime({
      hour: futureTime.getHours(),
      minute: futureTime.getMinutes(),
    });
  }, [setArrivalTime]);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      promoCode: "",
    },
  });

  const handleAddPromo = (formData) => {
    if (formData.promoCode === "20%OFF") {
      setPromoMessage("Promo applied!");
      setAppliedPromoCode(formData.promoCode);
      clearErrors("promoCode");
    } else {
      setPromoMessage("Not a valid code");
      setError("promoCode", {
        type: "manual",
        message: "Not a valid code",
      });
    }
  };

  const promoCode = watch("promoCode");
  useEffect(() => {
    if (!promoCode) {
      setPromoMessage("Use code 20%OFF");
      clearErrors("promoCode");
    }
  }, [promoCode, clearErrors]);

  const calculateTotalPrice = () => {
    const subtotal = numberOfPeople * basePrice;
    const fees = subtotal * feePercentage;
    const discount = subtotal * promoCodeDiscount;
    return subtotal + fees - discount;
  };

  const totalPrice = calculateTotalPrice();

  // set unique checkout urls
  const { refetch: generateToken } = useQuery(GENERATE_TOKEN, {
    skip: true,
    fetchPolicy: "network-only",
  });
  const [validateToken] = useMutation(VALIDATE_TOKEN);
  const setUniqueUrl = async () => {
    try {
      const { data } = await generateToken();
      const token = data.generateToken;
      if (token) {
        return token;
      } else {
        console.error("No token generated");
        return null;
      }
    } catch (error) {
      console.error("Error generating token:", error);
      return null;
    }
  };

  const bookingToCheckout = async () => {
    // generate a token, set to url
    const token = await setUniqueUrl();
    if (token) {
      console.log("token", token);
      navigate("/checkout");
      const url = new URL(window.location);
      url.searchParams.set("listing", listing.id);
      url.searchParams.set("token", token);
      window.history.pushState({ listingId: listing.id }, "", url);

      localStorage.setItem("checkoutToken", token);
    } else {
      console.error("Failed to generate checkout token");
    }
    // send booking details to redux
    dispatch(
      setBookingDetails({
        listing: listing,
        numberOfPeople: numberOfPeople,
        arrivalTime: {
          hour: `${arrivalTime.hour}`,
          minute: `${arrivalTime.minute}`,
        },
        specialRequests: "",
        pricing: pricingDetails,
      })
    );
  };

  // if logged out, show loggin prompt then proceed to checkout
  const handleLoggedOutBookingToCheckout = () => {
    if (isLoggedIn) {
      bookingToCheckout();
    } else {
      setShowLoginRequiredPrompt(true);
    }
  };

  return (
    <div className="booking-info-wrapper">
      {showLoginRequiredPrompt ? (
        <>
          <div className="back-to-booking-details">
            <WindowControlButton
              icon="arrow_back"
              action={() => setShowLoginRequiredPrompt(false)}
            />
            <span>Sign in to complete checkout</span>
          </div>
          <LoginRegisterComponent handleLoginToCheckout={bookingToCheckout} />
        </>
      ) : (
        <>
          <div className="booking-info-header">
            {/* <StepProgressBar
              progressSteps={progressSteps}
              currentStep={2}
              className="booking-progress-bar"
            /> */}
          </div>
          <div className="booking-info-body">
            <div className="your-booking-details">
              <div className="booking-detail-subheader">
                <h3>Your Booking</h3>
              </div>
              <div className="number-of-people">
                <div className="content">
                  <span className="material-symbols-outlined">
                    emoji_people
                  </span>
                  <span className="number">{numberOfPeople}</span>
                  <span className="text-1">
                    {numberOfPeople > 1 ? "people" : "person"}
                  </span>
                </div>
                <div className="action">
                  <WindowControlButton
                    icon="keyboard_arrow_up"
                    action={incrementNumberOfPeople}
                  />
                  <WindowControlButton
                    icon="keyboard_arrow_down"
                    action={decrementNumberOfPeople}
                  />
                </div>
              </div>
              <div className="booking-time">
                <div className="default-display">
                  <div className="content">
                    <span className="material-symbols-outlined">schedule</span>
                    <span className="time">
                      {arrivalTime.hour}:{arrivalTime.minute}
                    </span>
                    <span className="text-1">Arrival time</span>
                  </div>
                  <div className="action">
                    {userLocation.coordinates.lat !== null ||
                    userLocation.coordinates.lng !== null ? (
                      <div className="booking-time-route-types">
                        <div className="button-group">
                          <ButtonComponent
                            type="button"
                            className={`booking-time-route-button ${
                              routeType === "walking" ? "active" : ""
                            }`}
                            action={() => handleRouteTypeSwitch("walking")}
                          >
                            <span className="material-symbols-outlined">
                              directions_walk
                            </span>
                          </ButtonComponent>
                          <ButtonComponent
                            type="button"
                            className={`booking-time-route-button ${
                              routeType === "cycling" ? "active" : ""
                            }`}
                            action={() => handleRouteTypeSwitch("cycling")}
                          >
                            <span className="material-symbols-outlined">
                              directions_bike
                            </span>
                          </ButtonComponent>
                          <ButtonComponent
                            type="button"
                            className={`booking-time-route-button ${
                              routeType === "driving" ? "active" : ""
                            }`}
                            action={() => handleRouteTypeSwitch("driving")}
                          >
                            <span className="material-symbols-outlined">
                              directions_car
                            </span>
                          </ButtonComponent>
                        </div>
                        <div className="booking-time-route-result">
                          <span className="duration">
                            {formattedRouteData.duration}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <ButtonComponent
                        type="button"
                        className="booking-custom-time-button default-button control-button"
                        action={() => setShowTimePicker(!showTimePicker)}
                      >
                        <span>Custom time</span>
                        <span className="material-symbols-outlined">
                          {showTimePicker ? "arrow_drop_up" : "arrow_drop_down"}
                        </span>
                      </ButtonComponent>
                    )}
                  </div>
                </div>
                <div className="booking-custom-time">
                  {userLocation.coordinates.lat !== null ||
                  userLocation.coordinates.lng !== null ? (
                    <ButtonComponent
                      type="button"
                      className="booking-custom-time-button default-button control-button"
                      action={() => setShowTimePicker(!showTimePicker)}
                    >
                      <span>Custom time</span>
                      <span className="material-symbols-outlined">
                        {showTimePicker ? "arrow_drop_up" : "arrow_drop_down"}
                      </span>
                    </ButtonComponent>
                  ) : null}
                  {showTimePicker && (
                    <TimePicker setArrivalTime={setArrivalTime} />
                  )}
                </div>
              </div>
            </div>
            <div className="booking-price-details">
              <div className="booking-detail-subheader">
                <h3>Price Details</h3>
              </div>
              <div className="price-detail-promo">
                <button
                  onClick={() => setAddPromoCode(!addPromoCode)}
                  className="price-detail add-promo-button"
                >
                  <div className="content-left">
                    <span className="material-symbols-outlined">sell</span>
                    <span>Add promo code</span>
                  </div>
                  <div className="content-right">
                    <span>{appliedPromoCode}</span>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </div>
                </button>
                {addPromoCode && (
                  <Form.Root
                    onSubmit={handleSubmit(handleAddPromo)}
                    className="price-detail price-add-promo"
                  >
                    <Form.Field className="content-left">
                      <Form.Control type="text" {...register("promoCode")} />
                      <Form.Message className="field-message">
                        {promoMessage}
                      </Form.Message>
                    </Form.Field>
                    <Form.Field className="content-right">
                      <Form.Submit>add</Form.Submit>
                    </Form.Field>
                  </Form.Root>
                )}
              </div>
              <div className="price-detail-breakdown">
                <div className="price-detail price-calc">
                  <div className="content-left">
                    <span className="text-2">
                      {numberOfPeople} x £{pricingDetails.basePrice.toFixed(2)}
                      /per person
                    </span>
                  </div>
                  <div className="content-right">
                    <span className="text-2">
                      £{(numberOfPeople * pricingDetails.basePrice).toFixed(2)}
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
                      £{pricingDetails.totalFees.toFixed(2)}
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
                {appliedPromoCode && (
                  <div className="price-detail price-applied-promo">
                    <div className="content-left">
                      <span className="text-2">Promo</span>
                      <span className="text-2">{appliedPromoCode}</span>
                    </div>
                    <div className="content-right">
                      <span className="text-2">
                        -£{pricingDetails.totalPromos.discount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="price-detail price-total">
                  <div className="content-left">
                    <h2>Total price</h2>
                  </div>
                  <div className="content-right">
                    <h2>£{pricingDetails.totalPrice.toFixed(2)}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonComponent
            type="button"
            className="default-button action-button checkout-button"
            action={handleLoggedOutBookingToCheckout}
          >
            Continue to payment
          </ButtonComponent>
        </>
      )}
    </div>
  );
}
