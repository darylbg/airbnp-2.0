import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from "mapbox-gl";
import { Link, useNavigate } from "react-router-dom";
import LoginRegisterComponent from "../../LoginRegisterComponents/LoginRegisterComponent";
import "./ListingDetail.css";
import "mapbox-gl/dist/mapbox-gl.css";
import PinIcon from "../../../assets/images/icons/pin_icon3.png";
import { setBookingDetails } from "../../../reducers/bookingReducer";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import Carousel from "react-multi-carousel";
import StepProgressBar from "../../PrimitiveComponents/StepProgressBar/StepProgressBar";
import {
  CustomLeftArrow,
  CustomRightArrow,
} from "../../SearchListing/SearchListing";
import WindowControlButton from "../../PrimitiveComponents/WindowControlButton/WindowControlButton";
import TimePicker from "../../PrimitiveComponents/TimePicker/TimePicker";

export default function ListingDetail() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const listing = useSelector(
    (state) => state.bookingCycle.booking.listingDetail?.listing
  );

  const userLocation = useSelector((state) => state.bookingCycle.userLocation);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLoginRequiredPrompt, setShowLoginRequiredPrompt] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  // const [arrivalTime, setArrivalTime] = useState("");
  const [routeType, setRouteType] = useState("walking");
  const [routeData, setRouteData] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formattedRouteData, setFormattedRouteData] = useState({
    distance: null,
    duration: null,
    googleMapsLink: "",
  });
  const [walkingRouteData, setWalkingRouteData] = useState(null);
  const [formattedWalkingRouteData, setFormattedWalkingRouteData] = useState({
    distance: null,
    duration: null,
  });
  const [arrivalTime, setArrivalTime] = useState({
    hour: "",
    minute: "",
  });

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // Avoid initializing more than once

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [listing?.longitude || 0, listing?.latitude || 0], // Center the map initially
      zoom: 12,
    });

    mapRef.current.on("load", () => {
      console.log("user location", userLocation);
      if (
        userLocation.coordinates.lng !== null &&
        userLocation.coordinates.lat !== null
      ) {
        // Add markers for listing and user location
        const userMarkerEl = document.createElement("div");
        userMarkerEl.className = "custom-user-marker";
        userMarkerEl.style.backgroundImage = `url(${PinIcon})`;
        userMarkerEl.style.width = "40px";
        userMarkerEl.style.height = "40px";
        userMarkerEl.style.backgroundSize = "100%";

        new mapboxgl.Marker({
          element: userMarkerEl,
          offset: [0, -20],
          draggable: false,
        })
          .setLngLat([
            userLocation.coordinates.lng,
            userLocation.coordinates.lat,
          ])
          .addTo(mapRef.current);

        // Define bounds to include both markers if there are
        const bounds = new mapboxgl.LngLatBounds(
          [userLocation.coordinates.lng, userLocation.coordinates.lat],
          [listing?.longitude || 0, listing?.latitude || 0]
        );

        mapRef.current.fitBounds(bounds, { padding: 40 });
      }

      if (listing) {
        const listingMarker = document.createElement("div");
        listingMarker.className = "listing-marker";
        new mapboxgl.Marker({ element: listingMarker })
          .setLngLat([listing.longitude || 0, listing.latitude || 0])
          .addTo(mapRef.current);
      }

      defineRoute(
        [userLocation.coordinates.lng, userLocation.coordinates.lat],
        [listing?.longitude, listing?.latitude],
        "walking"
      ).then((data) => {
        setWalkingRouteData(data);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [listing, userLocation]);

  // useEffect to update route based on routeType
  useEffect(() => {
    if (userLocation && listing) {
      defineRoute(
        [userLocation.coordinates.lng, userLocation.coordinates.lat],
        [listing.longitude, listing.latitude],
        routeType
      );
    }
  }, [routeType, userLocation, listing]);

  const defineRoute = async (startLngLat, endLngLat, routeType) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${routeType}/${startLngLat.join(
      ","
    )};${endLngLat.join(
      ","
    )}?alternatives=true&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${
      mapboxgl.accessToken
    }`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        setRouteData(data.routes[0]);
        const routeGeoJson = data.routes[0].geometry;

        if (mapRef.current) {
          // Check if the route source already exists
          if (mapRef.current.getSource("route")) {
            mapRef.current.getSource("route").setData(routeGeoJson);
          } else {
            mapRef.current.addSource("route", {
              type: "geojson",
              data: routeGeoJson,
            });

            mapRef.current.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#0588F0",
                "line-width": 5,
              },
            });
          }
        }
        return data.routes[0];
      } else {
        console.warn("No routes found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const handleRouteTypeSwitch = (method) => {
    setRouteType(method);
  };

  const handleDurationFormat = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes < 1440) {
      // less than a day
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr${hours > 1 ? "s" : ""} ${
        remainingMinutes > 0 ? remainingMinutes + " min" : ""
      }`;
    } else {
      // one day or more
      const days = Math.floor(minutes / 1440);
      const remainingMinutes = minutes % 1440;
      const hours = Math.floor(remainingMinutes / 60);
      const finalMinutes = remainingMinutes % 60;
      return `${days} day${days > 1 ? "s" : ""} ${
        hours > 0 ? hours + " hr" + (hours > 1 ? "s" : "") : ""
      } ${finalMinutes > 0 ? finalMinutes + " min" : ""}`;
    }
  };

  const handleDistanceFormat = (meters) => {
    const kilometers = (meters * 0.00062137).toFixed(2);
    return `${kilometers} miles`;
  };

  const handleDurationToTimeFormat = (seconds) => {
    const now = new Date();

    now.setSeconds(now.getSeconds() + seconds);

    // Extract the hours, minutes, and seconds from the new time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // const secs = now.getSeconds();

    // Format the time components to always be two digits
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    // const formattedSeconds = secs.toString().padStart(2, "0");

    // Combine the formatted time components into the desired format
    // setArrivalTime(`${formattedHours}:${formattedMinutes}`);
    setArrivalTime((prev) => ({
      ...prev,
      hour: formattedHours,
      minute: formattedMinutes,
    }));
  };

  useEffect(() => {
    if (routeData && userLocation.coordinates.lat !== null) {
      const formattedDurationToTime = handleDurationToTimeFormat(
        routeData.duration
      );
    }
  }, [routeType, routeData]);

  useEffect(() => {
    if (routeData && userLocation.coordinates.lat !== null) {
      // set walking data fixed
      const formattedWalkingDistance = handleDistanceFormat(
        walkingRouteData?.distance
      );
      const formattedWalkingDuration = handleDurationFormat(
        walkingRouteData?.duration
      );
      setFormattedWalkingRouteData({
        distance: formattedWalkingDistance,
        duration: formattedWalkingDuration,
      });
      // set other transport methods when called
      const formattedDistance = handleDistanceFormat(routeData.distance);
      const formattedDuration = handleDurationFormat(routeData.duration);
      const originLat = userLocation.coordinates.lat;
      const originLng = userLocation.coordinates.lng;
      const destinationLat = listing.latitude;
      const destinationLng = listing.longitude;
      const travelMode = routeType;
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&travelmode=${travelMode}`;
      setFormattedRouteData({
        duration: formattedDuration,
        distance: formattedDistance,
        googleMapsLink: directionsUrl,
      });
    }
  }, [routeData]);

  // image carousel deets
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

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
        numberOfPeople: 2,
        arrivalTime: 1245,
        specialRequests: "Your special request here",
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

    setArrivalTime({
      hour: hours < 10 ? `0${hours}` : hours,
      minute: minutes < 10 ? `0${minutes}` : minutes,
    });
  }, []);

  return (
    <div className="listing-booking-content">
      <div className="listing-booking-details">
        <div className="booking-images">
          {listing ? (
            <Carousel
              swipeable={false}
              draggable={false}
              showDots={listing?.listing_image.length > 1}
              arrows={listing?.listing_image.length > 1}
              responsive={responsive}
              infinite={true}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              containerClass="carousel-container"
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
            >
              {listing?.listing_image.map((image, index) => (
                <img key={index} src={image} alt="image" className="" />
              ))}
            </Carousel>
          ) : (
            <div>no images</div>
          )}
        </div>
        <div className="booking-header">
          <p className="house-type">private home</p>
          <h2 className="title">{listing?.listing_title}</h2>
          <div className="booking-header-subtitle">
            {listing?.availability ? (
              <span className="available">Open now</span>
            ) : (
              <span className="unavailable">Closed</span>
            )}
            {userLocation.coordinates.lng == null ||
            userLocation.coordinates.lat == null ? (
              <span>set your location to view travel</span>
            ) : (
              <div className="travel">
                <div className="duration">
                  <span class="material-symbols-outlined">directions_walk</span>
                  <span className="text">
                    {formattedWalkingRouteData?.duration !== null
                      ? formattedWalkingRouteData.duration
                      : ""}
                  </span>
                </div>
                <div className="distance">
                  <span class="material-symbols-outlined">
                    radio_button_unchecked
                  </span>
                  <strong className="text">
                    {formattedWalkingRouteData?.distance !== null
                      ? formattedWalkingRouteData.distance
                      : ""}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="booking-body"></div>
        <div
          style={{ height: "500px", width: "100%" }} // Adjust height and width as needed
          ref={mapContainerRef}
          className="map-container"
        ></div>
        {(userLocation.coordinates.lat !== null ||
          userLocation.coordinates.lng !== null) && (
          <div className="search-route-types">
            <div className="button-group">
              <ButtonComponent
                type="button"
                className={`route-type-btn ${
                  routeType === "walking" ? "active" : ""
                }`}
                action={() => handleRouteTypeSwitch("walking")}
              >
                <span class="material-symbols-outlined">directions_walk</span>
                <span> Walk</span>
              </ButtonComponent>
              <ButtonComponent
                type="button"
                className={`route-type-btn ${
                  routeType === "cycling" ? "active" : ""
                }`}
                action={() => handleRouteTypeSwitch("cycling")}
              >
                <span class="material-symbols-outlined">directions_bike</span>
                <span> Cycle</span>
              </ButtonComponent>
              <ButtonComponent
                type="button"
                className={`route-type-btn ${
                  routeType === "driving" ? "active" : ""
                }`}
                action={() => handleRouteTypeSwitch("driving")}
              >
                <span class="material-symbols-outlined">directions_car</span>
                <span> Drive</span>
              </ButtonComponent>
            </div>
            <div className="route-type-result">
              <strong className="distance">
                {formattedRouteData.distance}
              </strong>
              <strong className="duration">
                {formattedRouteData.duration}
              </strong>
              <Link
                to={formattedRouteData.googleMapsLink}
                className="get-directions"
                target="_blank"
              >
                Get directions
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="listing-booking-info">
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
                <h3>Your booking</h3>
                <div className="your-booking-details">
                  <div className="number-of-people">
                    <div className="content">
                      <span class="material-symbols-outlined">
                        emoji_people
                      </span>
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
                         <span>Custom time</span>
                        {showTimePicker ? (
                          <span class="material-symbols-outlined">
                            arrow_drop_up
                          </span>
                        ) : (
                          <span class="material-symbols-outlined">
                            arrow_drop_down
                          </span>
                        )}
                      </ButtonComponent>
                      {showTimePicker && (
                        <TimePicker
                          setArrivalTime={setArrivalTime}
                          arrivalTime={arrivalTime}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="booking-price-details"></div>
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
      </div>
    </div>
  );
}
