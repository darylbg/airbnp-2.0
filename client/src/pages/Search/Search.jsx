import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_LISTINGS } from "../../utils/queries";
import { useDispatch, useSelector } from "react-redux";
import { SearchBox } from "@mapbox/search-js-react";
import * as Form from "@radix-ui/react-form";
import SearchListing from "../../components/SearchListing/SearchListing";
import "./Search.css";
import SearchMap from "../../components/SearchMap/SearchMap";
import {
  setAllListings,
  clearRefetchFlag,
} from "../../reducers/allListingsReducer";
import ButtonComponent from "../../components/PrimitiveComponents/ButtonComponent/ButtonComponent";
import { setUserLocation } from "../../reducers/bookingReducer";
import { Link } from "react-router-dom";

export default function Search() {
  const dispatch = useDispatch();
  const [listings, setListings] = useState(null);
  const [hoveredListing, setHoveredListing] = useState(null);
  const [routeType, setRouteType] = useState("walking");
  const [routeData, setRouteData] = useState(null);
  const [formattedRouteData, setFormattedRouteData] = useState({
    distance: null,
    duration: null,
    googleMapsLink: "",
  });
  const [mapCenterCoordinates, setMapCenterCoordinates] = useState({
    lat: 52.54851,
    lng: -1.9801,
  });
  const { error, loading, data, refetch } = useQuery(GET_ALL_LISTINGS);
  const allListingEntities = useSelector(
    (state) => state.allListings.defaultListings.entities
  );
  const refetchListings = useSelector(
    (state) => state.allListings.refetchListings
  );

  const selectedListing = useSelector(
    (state) => state.bookingCycle.booking.selectedListing
  );

  const userLocation = useSelector(
    (state) => state.bookingCycle.userLocation.coordinates
  );
  // console.log(userLocation);

  useEffect(() => {
    if (refetchListings) {
      refetch().then(() => {
        dispatch(clearRefetchFlag());
      });
    }
  }, [refetchListings, refetch, dispatch]);

  useEffect(() => {
    if (data) {
      const listings = data.getAllListings;
      dispatch(setAllListings(listings));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (allListingEntities) {
      setListings(Object.values(allListingEntities));
    }
  }, [allListingEntities]);

  const handleAddressSearch = (result) => {
    const features = result.features[0];
    const userLocation = {
      coordinates: {
        lng: features.geometry.coordinates[0],
        lat: features.geometry.coordinates[1],
      },
      fullAddress: features.properties.full_address,
    };
    dispatch(setUserLocation(userLocation));
    setMapCenterCoordinates({
      lng: userLocation.coordinates.lng,
      lat: userLocation.coordinates.lat,
    });
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
    // console.log(routeData?.distance)
    const kilometers = (meters * 0.00062137).toFixed(2);
    return `${kilometers} miles`;
  };

  useEffect(() => {
    if (routeData && userLocation.lat !== null) {
      const formattedDistance = handleDistanceFormat(routeData.distance);
      const formattedDuration = handleDurationFormat(routeData.duration);
      const originLat = userLocation.lat;
      const originLng = userLocation.lng;
      const destinationLat = selectedListing?.latitude;
      const destinationLng = selectedListing?.longitude;
      const travelMode = routeType;
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&travelmode=${travelMode}`;
      setFormattedRouteData({
        duration: formattedDuration,
        distance: formattedDistance,
        googleMapsLink: directionsUrl,
      });
    }
  }, [routeData]);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = {
          coordinates: {
            lng: longitude,
            lat: latitude,
          },
          fullAddress: "",
        };
        dispatch(setUserLocation(userLocation));
        setMapCenterCoordinates({
          lng: userLocation.coordinates.lng,
          lat: userLocation.coordinates.lat,
        });
      });
    } else {
      console.log("error");
      alert("geolocation not supported on this browser");
    }
  };

  if (error) {
    console.log(error);
  }
  if (error) return <p>Error :</p>;

  return (
    <div className="search-page">
      <div className="search-listings">
        <div className="search-listings-header">
          <div className="search-listings-input">
            <div className="locators">
              <Form.Root className="search-listings-form">
                <Form.Field>
                  <SearchBox
                    accessToken="pk.eyJ1IjoiZGF6emExMjMiLCJhIjoiY2x5MDM4c29yMGh1eTJqcjZzZTRzNzEzaiJ9.dkx0lvLDJy35oWNvOW5mFg"
                    options={{
                      language: "en",
                      country: "GB",
                    }}
                    placeholder="Search address or city"
                    onRetrieve={handleAddressSearch}
                  />
                </Form.Field>
              </Form.Root>
              <ButtonComponent
                className="locate-user-button default-button primary-button"
                action={handleLocateUser}
              >
                Near me
                <span className="material-symbols-outlined">
                  location_searching
                </span>
              </ButtonComponent>
            </div>
            {selectedListing &&
              (userLocation.lat !== null || userLocation.lng !== null) && (
                <div className="search-route-types">
                  <div className="button-group">
                    <ButtonComponent
                      type="button"
                      className={`route-type-btn ${
                        routeType === "walking" ? "active" : ""
                      }`}
                      action={() => handleRouteTypeSwitch("walking")}
                    >
                      <span class="material-symbols-outlined">
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
                      <span class="material-symbols-outlined">
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
                      <span class="material-symbols-outlined">
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
              )}
          </div>
          <div className="search-listings-filter">
            <p className="text">{listings?.length}+ locations near you</p>
            <ButtonComponent className="default-button control-button">
              Filter
            </ButtonComponent>
          </div>
        </div>
        <div className="search-listings-display scrollbar-1">
          {listings &&
            listings.map((listing) => (
              <SearchListing
                key={listing._id}
                listing={listing}
                setHoveredListing={setHoveredListing}
                hoveredListing={hoveredListing}
                // centerMapOnListing={centerMapOnListing}
              />
            ))}
        </div>
      </div>
      <div className="search-map">
        {loading ? (
          <p>Loading locations...</p>
        ) : (
          <SearchMap
            listings={listings}
            setHoveredListing={setHoveredListing}
            hoveredListing={hoveredListing}
            mapLoading={loading}
            mapCenterCoordinates={mapCenterCoordinates}
            setMapCenterCoordinates={setMapCenterCoordinates}
            routeType={routeType}
            setRouteData={setRouteData}
          />
        )}
      </div>
    </div>
  );
}
