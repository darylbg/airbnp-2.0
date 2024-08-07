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
  const bookingDetails = useSelector(
    (state) => state.bookingCycle.booking.bookingDetails
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLoginRequiredPrompt, setShowLoginRequiredPrompt] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [addPromoCode, setAddPromoCode] = useState(false);
  const [promoMessage, setPromoMessage] = useState("Use code 10%OFF");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [feePercentage, setFeePercentage] = useState(0.02);
  const [feeInfoDialog, setFeeInfoDialog] = useState(false);

  const basePrice = listing?.price || 0;
  const promoCodeDiscount = appliedPromoCode === "10%OFF" ? 0.1 : 0;

  // Function to set booking details in Redux store
  const handleReduxCheckout = () => {
    dispatch(
      setBookingDetails({
        listing: listing,
        numberOfPeople: numberOfPeople,
        arrivalTime: {hour: `${arrivalTime.hour}`, minute: `${arrivalTime.minute}`},
        specialRequests: "",
        totalPrice: totalPrice.toFixed(2)
      })
    );
  };

  // Function to handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (isLoggedIn) {
      handleReduxCheckout();
      navigate("/checkout");
    } else {
      setShowLoginRequiredPrompt(true);
    }
  };

  // Function to handle login and proceed to checkout
  const handleLoginToCheckout = () => {
    handleReduxCheckout();
    setShowLoginRequiredPrompt(false);
    navigate("/checkout");
  };

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
    if (formData.promoCode === "10%OFF") {
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
      setPromoMessage("Use code 10%OFF");
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
          <LoginRegisterComponent
            handleLoginToCheckout={handleLoginToCheckout}
          />
        </>
      ) : (
        <>
          <div className="booking-info-header">
            <StepProgressBar
              progressSteps={progressSteps}
              currentStep={2}
              className="booking-progress-bar"
            />
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
                    userLocation.coordinates.lng !== null ? (<ButtonComponent
                    type="button"
                    className="booking-custom-time-button default-button control-button"
                    action={() => setShowTimePicker(!showTimePicker)}
                  >
                    <span>Custom time</span>
                    <span className="material-symbols-outlined">
                      {showTimePicker ? "arrow_drop_up" : "arrow_drop_down"}
                    </span>
                  </ButtonComponent>): null}
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
                      {numberOfPeople} people at £{basePrice}/per person
                    </span>
                  </div>
                  <div className="content-right">
                    <span className="text-2">£{numberOfPeople * basePrice}</span>
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
                      £{(numberOfPeople * basePrice * feePercentage).toFixed(2)}
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
                        -£
                        {(
                          numberOfPeople *
                          basePrice *
                          promoCodeDiscount
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="price-detail price-total">
                  <div className="content-left">
                    <h2>Total price</h2>
                  </div>
                  <div className="content-right">
                    <h2>£{totalPrice.toFixed(2)}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonComponent
            type="button"
            className="default-button action-button checkout-button"
            action={handleProceedToCheckout}
          >
            Continue to payment
          </ButtonComponent>
        </>
      )}
    </div>
  );
}
