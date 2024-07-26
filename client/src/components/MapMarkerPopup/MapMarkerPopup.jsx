import React, { useEffect, useState } from "react";
import PrimaryButton from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./MapMarkerPopup.css";

export default function MapMarkerPopup({
  listing,
  openDetailDialog,
  startLngLat,
  accessToken
}) {
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  useEffect(() => {
    const endLngLat = [listing.longitude, listing.latitude];
    const defineRoute = async (startLngLat, endLngLat) => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${startLngLat.join(',')};${endLngLat.join(',')}?alternatives=true&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${accessToken}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
    
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0]);
        } else {
          console.warn("No routes found");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (startLngLat && endLngLat) {
      defineRoute(startLngLat,endLngLat);
    }

    
  }, []);

  return (
    <div className="map-popup">
      <div className="map-popup-heading">
        <h1 className="title">{listing.listing_title}</h1>
        <span className="price">{listing.price} /visit</span>
      </div>
      <div className="map-popup-content">
        {listing.availability ? (
          <div className="availability available">
            <span class="material-symbols-outlined">adjust</span>
            <span className="text">Available</span>
          </div>
        ) : (
          <div className="availability unavailable">
            <span class="material-symbols-outlined">cancel</span>
            <span className="text">Not available</span>
          </div>
        )}
        <div className="rating">
          <span class="material-symbols-outlined">star_rate</span>
          <span className="text">4.9</span>
        </div>
        <div className="distance">
          <span class="material-symbols-outlined">directions_walk</span>
          <span className="text">{route?.distance} miles</span>
          <span className="text">{route?.duration} minutes</span>
        </div>
      </div>
      <div className="map-popup-action">
        <PrimaryButton
          type="button"
          className="default-button map-popup-button"
          loading={loading}
          action={(e) => openDetailDialog(e, listing)}
        >
          Book this bathroom
        </PrimaryButton>
      </div>
    </div>
  );
}
