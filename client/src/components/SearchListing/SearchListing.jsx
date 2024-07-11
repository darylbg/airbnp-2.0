import React from 'react';
import "./SearchListing.css";

export default function SearchListing({listing}) {
    // console.log(listing);
    // const listingImg = listing.listing_image[0];
    // console.log("img", listingImg);
  return (
    <div className='search-listing'>
        <div className="search-listing-image">
            <img src={listing.listing_image[0]} alt="" />
        </div>
      {listing.listing_title}
    </div>
  )
}
