import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { selectedListing } from "../../reducers/bookingReducer";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./SearchListing.css";

export default function SearchListing({
  listing,
  hoveredListing,
  setHoveredListing,
  centerMapOnListing,
}) {
  const dispatch = useDispatch();
  const isHovered = hoveredListing && hoveredListing.id === listing.id;

  const searchListingSelected = (listing) => {
    dispatch(selectedListing(listing));
  };

  return (
    <div
      className="search-listing"
      onMouseEnter={() => setHoveredListing(listing)}
      onMouseLeave={() => setHoveredListing(null)}
      style={{ border: isHovered ? "2px solid blue" : "2px solid black" }}
      onClick={() => centerMapOnListing(listing)}
    >
      <div className="search-listing-image">
        <img src={listing && listing.listing_image[0]} alt="" />
      </div>
      {listing.listing_title}
      {listing && listing.fullAddress}
      <ButtonComponent
        className="control-button"
        type="button"
        action={() => searchListingSelected(listing)}
      >
        See detail
      </ButtonComponent>
    </div>
  );
}
