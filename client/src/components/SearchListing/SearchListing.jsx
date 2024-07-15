import React, { useState } from 'react';
import "./SearchListing.css";

export default function SearchListing({listing, hoveredListing, setHoveredListing}) {

  const isHovered = hoveredListing && hoveredListing.id === listing.id;
  
  return (
    <div 
    className='search-listing'
    onMouseEnter={() => setHoveredListing(listing)}
    onMouseLeave={() => setHoveredListing(null)}
    style={{border: isHovered? "2px solid blue" : "2px solid black"}}
    >
        <div className="search-listing-image">
            <img src={listing && listing.listing_image[0]} alt="" />
            
        </div>
      {listing.listing_title}{listing && listing.fullAddress}
    </div>
  )
}
