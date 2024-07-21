import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_LISTINGS } from "../../utils/queries";
import { useDispatch, useSelector } from "react-redux";
import { SearchBox } from "@mapbox/search-js-react";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import SearchListing from "../../components/SearchListing/SearchListing";
import "./Search.css";
import SearchMap from "../../components/SearchMap/SearchMap";
import {
  setAllListings,
  clearRefetchFlag,
} from "../../reducers/allListingsReducer";
import ButtonComponent from "../../components/PrimitiveComponents/ButtonComponent/ButtonComponent";
import { resetBooking, setUserLocation } from "../../reducers/bookingReducer";

export default function Search() {
  const dispatch = useDispatch();
  const [listings, setListings] = useState(null);
  const [hoveredListing, setHoveredListing] = useState(null);
  const [routeType, setRouteType] = useState("walking");
  const [routeData, setRouteData] = useState(null);
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
    (state) => state.bookingCycle.booking.selectedListing?.listing
  );

  const userLocation = useSelector(
    (state) => state.bookingCycle.userLocation.coordinates
  );

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

  const centerMapOnListing = (listing) => {
    setMapCenterCoordinates({ lat: listing.latitude, lng: listing.longitude });
  };

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

  // change directions icon
  const getIconName = (weightName) => {
    switch (weightName) {
      case "pedestrian":
        return "directions_walk";
      case "auto":
        return "directions_car";
      case "cyclability":
        return "directions_bike";
      default:
        return "directions_walk";
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
            <Form.Root>
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
            {selectedListing &&
              (userLocation.lat !== null || userLocation.lng !== null) && (
                <div className="search-routes">
                  <button onClick={() => setRouteType("walking")}>walk</button>
                  <button onClick={() => setRouteType("cycling")}>cycle</button>
                  <button onClick={() => setRouteType("driving")}>drive</button>
                  <div className="route-type">
                    <span class="material-symbols-outlined">
                      {getIconName(routeData?.weight_name)}
                    </span>
                    <span>{routeData?.distance}</span>
                  </div>
                </div>
              )}
          </div>
          <div className="search-listings-filter">
            <p className="text">10,000+ locations near you</p>
            <ButtonComponent className="default-button control-button">
              Filter
            </ButtonComponent>
          </div>
        </div>
        <div className="search-listings-display">
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
