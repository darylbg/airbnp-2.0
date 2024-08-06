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
  const [promoMessage, setPromoMessage] = useState("use code 10%OFF");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");

  // set number of people booking for
  const incrementNumberOfPeople = () => {
    const max = 10;
    if (numberOfPeople < max) {
      setNumberOfPeople(numberOfPeople + 1);
    }
  };

  const decrementNumberOfPeople = () => {
    const min = 1;
    if (numberOfPeople > min) {
      setNumberOfPeople(numberOfPeople - 1);
    }
  };

  // Function to set booking details in Redux store
  const handleReduxCheckout = () => {
    dispatch(
      setBookingDetails({
        listing: listing,
        numberOfPeople: numberOfPeople,
        arrivalTime: `${arrivalTime.hour}:${arrivalTime.minute}`,
        specialRequests: "",
      })
    );
  };

  // Function to handle proceed to checkout
  const handleProceedToCheckout = () => {
    console.log("to checkout");
    if (isLoggedIn) {
      handleReduxCheckout();
      navigate("/checkout");
    } else {
      console.log("Please log in");
      setShowLoginRequiredPrompt(true);
    }
  };

  // Function to handle login and proceed to checkout
  const handleLoginToCheckout = () => {
    console.log("Login to checkout");
    handleReduxCheckout();
    setShowLoginRequiredPrompt(false);
    navigate("/checkout");
  };

  const progressSteps = [
    { 1: "Select listing" },
    { 2: "Booking info" },
    { 3: "Payment" },
  ];

  useEffect(() => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 20 * 60000); // Adds 20 minutes in milliseconds

    const hours = futureTime.getHours();
    const minutes = futureTime.getMinutes();

    setArrivalTime({ hour: hours, minute: minutes });
  }, []);

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

  const testPromoCode = "10%OFF";
  const handleAddPromo = (formData) => {
    if (formData.promoCode == testPromoCode) {
      console.log(formData.promoCode, testPromoCode);
      setPromoMessage("Promo applied!");
      setAppliedPromoCode(testPromoCode);
      clearErrors("promoCode");
    } else {
      console.log(formData.promoCode, testPromoCode);
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

  return (
    <div className="booking-info-wrapper">
      {showLoginRequiredPrompt ? (
        <>
          <div className="back-to-booking-details">
            <WindowControlButton
              icon="arrow_back"
              action={() => setShowLoginRequiredPrompt(false)}
            />
            <span>sign in to complete checkout</span>
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
              <h3>Your booking</h3>
              <div className="number-of-people">
                <div className="content">
                  <span class="material-symbols-outlined">emoji_people</span>
                  <span className="number">{numberOfPeople}</span>
                  <span className="text">
                    {numberOfPeople > 1 ? "people" : "person"}
                  </span>
                </div>
                <div className="action">
                  <WindowControlButton
                    className=""
                    icon="keyboard_arrow_up"
                    action={incrementNumberOfPeople}
                  />
                  <WindowControlButton
                    className=""
                    icon="keyboard_arrow_down"
                    action={decrementNumberOfPeople}
                  />
                </div>
              </div>
              <div className="booking-time">
                <div className="default-display">
                  <div className="content">
                    <span class="material-symbols-outlined">schedule</span>
                    <span className="time">
                      {arrivalTime.hour}:{arrivalTime.minute}
                    </span>
                    <span className="text">Arrival time</span>
                  </div>
                  <div className="action">
                    {(userLocation.coordinates.lat !== null ||
                      userLocation.coordinates.lng !== null) && (
                      <div className="booking-time-route-types">
                        <div className="button-group">
                          <ButtonComponent
                            type="button"
                            className={`booking-time-route-button ${
                              routeType === "walking" ? "active" : ""
                            }`}
                            action={() => handleRouteTypeSwitch("walking")}
                          >
                            <span class="material-symbols-outlined">
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
                            <span class="material-symbols-outlined">
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
                            <span class="material-symbols-outlined">
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
                    )}
                  </div>
                </div>
                <div className="booking-custom-time">
                  <ButtonComponent
                    type="button"
                    className="booking-custom-time-button default-button control-button"
                    action={() => setShowTimePicker(!showTimePicker)}
                  >
                    Custom time
                  </ButtonComponent>
                  {showTimePicker && (
                    <TimePicker setArrivalTime={setArrivalTime} />
                  )}
                </div>
              </div>
            </div>
            <div className="booking-price-details">
              <h3>Price Details</h3>
              <button
                onClick={() => setAddPromoCode(!addPromoCode)}
                className="price-detail price-add-promo"
              >
                <div className="content-left">
                  <span class="material-symbols-outlined">sell</span>
                  <span>Add promo code</span>
                </div>
                <div className="content-right">
                    <span>{appliedPromoCode}</span>
                  <span class="material-symbols-outlined">chevron_right</span>
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
              <div className="price-detail price-breakdown">
                <div className="content-left">
                  <span>promo code</span>
                </div>
                <div className="content-right">
                  <span>right</span>
                </div>
              </div>
              <div className="price-detail price-fees">
                <div className="content-left">
                  <span>price fees</span>
                </div>
                <div className="content-right">
                  <span>right</span>
                </div>
              </div>
              <div className="price-detail price-applied-promo">
                <div className="content-left">
                  <span>applied promo</span>
                </div>
                <div className="content-right">
                  <span>right</span>
                </div>
              </div>
              <div className="price-detail price-total">
                <div className="content-left">
                  <span>total price</span>
                </div>
                <div className="content-right">
                  <span>right</span>
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
