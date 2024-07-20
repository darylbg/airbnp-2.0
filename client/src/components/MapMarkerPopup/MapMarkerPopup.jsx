import React, { useEffect, useState } from "react";
import PrimaryButton from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./MapMarkerPopup.css";
import { useSelector } from "react-redux";

export default function MapMarkerPopup({ listing, handleRouteTypes, openDetailDialog, routeData }) {

  const [loading, setLoading] = useState(false);

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
          <span className="text">{routeData?.distance}</span>
        </div>
        <button onClick={() => handleRouteTypes("walking")}>walk</button>
        <button onClick={() => handleRouteTypes("cycling")}>cycle</button>
        <button onClick={() => handleRouteTypes("driving")}>drive</button>
      </div>
      <div className="map-popup-action">
        <PrimaryButton
          type="button"
          className="default-button map-popup-button"
          loading={loading}
          action={openDetailDialog}
        >
          See Detail
        </PrimaryButton>
      </div>
    </div>
  );
}
