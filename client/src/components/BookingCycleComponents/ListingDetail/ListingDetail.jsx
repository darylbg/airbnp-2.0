import React from 'react';
import { useSelector } from 'react-redux';

export default function ListingDetail() {
    const listing = useSelector((state) => state.bookingCycle.booking.listingDetail);
  return (
    <div>
      {listing?.listing_title}
    </div>
  )
}
