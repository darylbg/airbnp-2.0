import React from "react";

export default function ListingDisplay({ props }) {
  return (
    <div className="listing">
      <div className="listing-header">
        <div className="listing-header-text"></div>
        <div className="listing-header-action"></div>
      </div>
      <div className="listing-body">
        <div className="listing-body-image">
          <img src="" alt="" />
        </div>
        <div className="listing-body-content">
          <div className="listing-title"></div>
          <div className="listing-description"></div>
          <div className="listing-amenities">
            <div className="listing-amenity"></div>
          </div>
        </div>
        <div className="listing-body-actions">
          <div className="listing-button-group"></div>
          <div className="listing-overview"></div>
        </div>
      </div>
    </div>
  );
}
