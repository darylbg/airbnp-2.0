import React from 'react';
import "./MapMarkerPopup.css"

export default function MapMarkerPopup({listing}) {
  return (
    <div className='map-popup'>
      <div className="map-popup-heading">
        <h2 className="title">{listing.listing_title}</h2>
        <p className='price'>{listing.price}{" "}/visit</p>
      </div>
      <div className="map-popup-content"></div>
      <div className="map-popup-action"></div>
      
    </div>
  )
}
