import React from 'react';
import "./MapMarkerPopup"

export default function MapMarkerPopup({listing}) {
  return (
    <div className='map-marker-popup'>
      {listing.listing_title}
    </div>
  )
}
