import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import mapboxgl from "mapbox-gl";
import { Link, NavLink, useLocation } from "react-router-dom";
import TrackIcon from "../../../assets/icons/ListingDetailIcons/track.png";
import "./ListingDetail.css";
import ShieldIcon from "../../../assets/icons/ListingDetailIcons/user-shield.png";
import ReservationIcon from "../../../assets/icons/ListingDetailIcons/reservation-smartphone.png";
import "mapbox-gl/dist/mapbox-gl.css";
import PinIcon from "../../../assets/images/icons/pin_icon3.png";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import Carousel from "react-multi-carousel";
import BookingInfo from "../BookingInfo/BookingInfo";
import toast from "react-hot-toast";
import { GET_LISTING_REVIEWS } from "../../../utils/queries/reviewsQueries";
import WindowControlButton from "../../PrimitiveComponents/WindowControlButton/WindowControlButton";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import RatingComponent from "../../PrimitiveComponents/RatingComponent/RatingComponent";
import { useQuery } from "@apollo/client";
import { Rating } from "react-simple-star-rating";
import { setListingReviews } from "../../../reducers/reviewsReducer";

export default function ListingDetail() {
  const dispatch = useDispatch();
  const listing = useSelector(
    (state) => state.bookingCycle.booking.listingDetail?.listing
  );
  console.log("this listing:", listing);

  const userLocation = useSelector((state) => state.bookingCycle.userLocation);

  const listingReviews = useSelector(
    (state) => state.reviews.listingReviews.reviews
  );

  const [routeType, setRouteType] = useState("walking");
  const [routeData, setRouteData] = useState(null);
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
      // console.log("user location", userLocation);
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
                "line-color": "#000",
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

  const getSharableLink = () => {
    const shareLink = window.location.href;
    navigator.clipboard.writeText(shareLink);
    toast.success(<ToastComponent message="Share link copied" />);
  };

  const {
    data: listingReviewsData,
    error: listingReviewsError,
    loading: listingReviewsLoading,
  } = useQuery(GET_LISTING_REVIEWS, {
    variables: { listingId: listing?.id },
    skip: !listing?.id,
  });

  useEffect(() => {
    if (listingReviewsData && !listingReviewsError && !listingReviewsLoading) {
      const reviews = listingReviewsData.getListingReviews;
      const count = reviews.length;
      const value =
        reviews.reduce((sum, review) => sum + review.rating_value, 0) / count ||
        0;
      const reviewData = {
        count: count,
        value: value,
        reviews: reviews,
      };
      dispatch(setListingReviews(reviewData));
    } else {
      console.log(listingReviewsError);
    }
  }, [dispatch, listingReviewsData]);

  function timeAgo(timestamp) {
    const now = Date.now(); // Get the current timestamp in milliseconds
    const secondsAgo = Math.floor((now - Number(timestamp)) / 1000); // Calculate the difference in seconds

    const minutes = Math.floor(secondsAgo / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (secondsAgo < 60) {
      return "now"; // If less than 60 seconds ago
    } else if (minutes < 60) {
      return minutes === 1 ? "1 minute" : `${minutes} minutes`;
    } else if (hours < 24) {
      return hours === 1 ? "1 hour" : `${hours} hours`;
    } else if (days < 7) {
      return days === 1 ? "1 day" : `${days} days`;
    } else if (weeks < 4) {
      return weeks === 1 ? "1 week" : `${weeks} weeks`;
    } else if (months < 12) {
      return months === 1 ? "1 month" : `${months} months`;
    } else {
      return years === 1 ? "1 year" : `${years} years`;
    }
  }

  return (
    <div
      className={`listing-booking-content ${listing?.availability}-listing-booking-content`}
    >
      <div className="listing-booking-details">
        <div className="booking-travel">
          <div className="booking-map-wrapper">
            <div
              style={{ height: "200px", width: "100%", borderRadius: "10px" }}
              ref={mapContainerRef}
              className="map-container booking-map"
            ></div>
          </div>
          {userLocation.coordinates.lat !== null ||
          userLocation.coordinates.lng !== null ? (
            <div className="search-route-types">
              <div className="button-group">
                <ButtonComponent
                  type="button"
                  className={`route-type-btn ${
                    routeType === "walking" ? "active" : ""
                  }`}
                  action={() => handleRouteTypeSwitch("walking")}
                >
                  <span className="material-symbols-outlined">
                    directions_walk
                  </span>
                  <span> Walk</span>
                </ButtonComponent>
                <ButtonComponent
                  type="button"
                  className={`route-type-btn ${
                    routeType === "cycling" ? "active" : ""
                  }`}
                  action={() => handleRouteTypeSwitch("cycling")}
                >
                  <span className="material-symbols-outlined">
                    directions_bike
                  </span>
                  <span> Cycle</span>
                </ButtonComponent>
                <ButtonComponent
                  type="button"
                  className={`route-type-btn ${
                    routeType === "driving" ? "active" : ""
                  }`}
                  action={() => handleRouteTypeSwitch("driving")}
                >
                  <span className="material-symbols-outlined">
                    directions_car
                  </span>
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
          ) : (
            <span>Set your location to view travel options</span>
          )}
        </div>
        <div className="booking-heading">
          <div className="booking-heading-text">
            <span className="building-type">Private residence</span>
            <h1>{listing?.listing_title}</h1>
            <div className="subheading">
              <RatingComponent
                value={listing?.average_rating.value}
                count={listing?.average_rating.count}
              />
              <div className="availability">
                <span>{listing?.availability ? "Open now" : "closed"}</span>
              </div>
              {formattedRouteData.distance !== null ? (
                <div className="distance">
                  <span class="material-symbols-outlined">location_on</span>
                  <span>{formattedRouteData.distance}</span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="booking-heading-action">
            <WindowControlButton
              type="button"
              className="default-button booking-heading-button"
              icon="favorite"
              tooltip="Like"
            ></WindowControlButton>
            <WindowControlButton
              type="button"
              className="default-button booking-heading-button"
              icon="ios_share"
              tooltip="Share"
              action={getSharableLink}
            ></WindowControlButton>
          </div>
        </div>
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
        <div className="booking-body">
          <div className="booking-host">
            <NavLink to={`/profile/${listing?.user_id.id}`}>
              <img src={listing?.user_id.user_image} alt="" />
            </NavLink>
            <div className="booking-host-text">
              <span className="display-name">
                Hosted by <strong>{listing?.user_id.display_name}</strong>
              </span>
              <span className="time-hosting">
                {timeAgo(listing?.user_id.created_at)} hosting
              </span>
            </div>
          </div>
          <div className="booking-description">
            <p>{listing?.listing_description}</p>
          </div>
          <div className="booking-amenities"></div>
          <div className="booking-specifics">
            <div className="specific">
              <img src={ReservationIcon} alt="location icon" />
              <span className="text">Online booking required.</span>
            </div>
            <div className="specific">
              <img src={TrackIcon} alt="location icon" />
              <span className="text">Full address provided at checkout.</span>
            </div>
            <div className="specific">
              <img src={ShieldIcon} alt="location icon" />
              <span className="text">Protection up to £10,000</span>
            </div>
          </div>
          <div className="booking-reviews">
            <div className="booking-reviews-header">
              <div className="caption">
                <span class="star">&#9733; Rating</span>
              </div>
              <div className="rating-overview">
                <span className="rating-value">
                  {listing?.average_rating.value.toFixed(1)}
                </span>
                <div className="rating-stars">
                  <Rating
                    size={16}
                    allowFraction={true}
                    readonly={true}
                    count={5}
                    initialValue={listing?.average_rating.value}
                  />
                  <span className="text">
                    {listing?.average_rating.count} reviews
                  </span>
                </div>
              </div>
            </div>
            <div className="booking-reviews-list">
              <ul className="listing-reviews">
                {listingReviews &&
                  listingReviews.map((review) => {
                    return (
                      <li key={review.id} className="listing-review">
                        <div className="listing-review-header">
                          <div className="review-details">
                            <img
                              className="image"
                              src={review.user.user_image}
                              alt=""
                            />
                            <div className="text">
                              <h3 className="display-name">
                                {review.user.display_name}
                              </h3>
                              <span className="created-at">
                                {timeAgo(review.createdAt)} ago
                              </span>
                            </div>
                          </div>
                          <Rating
                            size={16}
                            allowFraction={true}
                            readonly={true}
                            count={5}
                            initialValue={review.rating_value}
                          />
                        </div>
                        {review.message !== "" ? (
                          <div className="listing-review-body">
                            <p className="message">{review.rating_text}</p>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="listing-booking-info">
        <BookingInfo
          routeType={routeType}
          handleRouteTypeSwitch={handleRouteTypeSwitch}
          formattedRouteData={formattedRouteData}
          arrivalTime={arrivalTime}
          setArrivalTime={setArrivalTime}
        />
      </div>
    </div>
  );
}
