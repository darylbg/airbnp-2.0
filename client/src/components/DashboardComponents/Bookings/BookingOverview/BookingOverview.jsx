import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BookingOverview() {
  return (
    <div>
      booking overview
      <NavLink to="/dashboard/bookings/guest-reservations">guest reservations</NavLink>
      <NavLink to="/dashboard/bookings/my-booking-history">my booking history</NavLink>
    </div>
  )
}
