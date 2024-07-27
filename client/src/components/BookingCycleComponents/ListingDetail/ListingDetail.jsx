import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import LoginRegisterComponent from "../../LoginRegisterComponents/LoginRegisterComponent";
import "./ListingDetail.css";
import "mapbox-gl/dist/mapbox-gl.css";
import PinIcon from "../../../assets/images/icons/pin_icon3.png";
import { setBookingDetails } from "../../../reducers/bookingReducer";
import ToiletPaperIcon from "../../../assets/images/icons/toilet-paper.png";

export default function ListingDetail() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const listing = useSelector(
    (state) => state.bookingCycle.booking.listingDetail
  );
  const userLocation = useSelector((state) => state.bookingCycle.userLocation);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLoginRequiredPrompt, setShowLoginRequiredPrompt] = useState(false);
  const [routeType, setRouteType] = useState("walking");
  const [routeData, setRouteData] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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
          routeType
        );
      
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
                "line-color": "#000",
                "line-width": 5,
              },
            });
          }
        }
      } else {
        console.warn("No routes found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div className="listing-booking-content">
      <div className="listing-booking-details">
        <div
          style={{ height: "500px", width: "100%" }} // Adjust height and width as needed
          ref={mapContainerRef}
          className="map-container"
        />
        <button onClick={() => setRouteType("walking")}>Walking</button>
        <button onClick={() => setRouteType("cycling")}>Cycling</button>
        <button onClick={() => setRouteType("driving")}>Driving</button>
      </div>
      <div className="listing-booking-info">
        Booking info
        <button onClick={handleProceedToCheckout}>Checkout</button>
        {showLoginRequiredPrompt && (
          <LoginRegisterComponent
            handleLoginToCheckout={handleLoginToCheckout}
          />
        )}
      </div>
    </div>
  );
}
