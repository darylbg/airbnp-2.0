import React from "react";
import PrimaryButton from "../../../PrimitiveComponents/PrimaryButton/PrimaryButton";
import "./ListingDisplay.css";

// formate date back to 01/01/2001 formate
const formateDate = (date) => {
  date = new Date(+date);
  const day = String(date.getDay()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0)
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

export default function ListingDisplay({ props }) {
  return (
    <div className="listing">
      <div className="listing-header">
        <div className="listing-header-text">
          <span>Set availability of your listing</span>
        </div>
        <button className="availability-button">{props.availability ? "available": "unavailable"}</button>
      </div>
      <div className="listing-body">
        <div className="listing-body-images">
          <div className="first-image">
            <img src={props.listing_image[0]} alt="listing image" />
          </div>
          {props.listing_image.length > 1 ? (
            <div className="multiple-images">
              {props.listing_image.slice(1).map((image, index) => (
                <img key={index} src={image} alt="listing image" />
              ))}
            </div>
          ) : null}
        </div>
        <div className="listing-body-content">
          <h2 className="listing-title">{props.listing_title}</h2>
          <p>{formateDate(props.created_at)}</p>
          <p className="listing-description">{props.listing_description}</p>
          <div className="listing-amenities">
            <p>Amenities</p>
            <ul>
              <li className="listing-amenity"></li>
            </ul>
          </div>
        </div>
        <div className="listing-body-actions">
          <PrimaryButton className="edit-listing-button">
            Edit Listing
          </PrimaryButton>
          <div className="listing-insights">
            <div className="insights-divider"></div>
            <div className="insight">
              <strong className="insight-number">5</strong>
              <p className="insight-text">Booked</p>
            </div>
            <div className="insight">
              <strong className="insight-number">50</strong>
              <p className="insight-text">Viewed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
