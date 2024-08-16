import React from "react";
import { NavLink, useOutletContext } from "react-router-dom";
import "./BookingOverview.css";

export default function BookingsOverview({}) {
  return (
    <div className="booking-overview-content">
      <div className="booking-overview-cards">
        <NavLink
          to="/dashboard/bookings/guest-reservations"
          className="bookings-overview-card"
        >
          <div className="bookings-overview-card-header">
            <h2>GUEST RESERVATIONS</h2>
          </div>
          <div className="bookings-overview-card-body">
            <div className="card-item">
              <div className="icon-wrapper active-icon-wrapper">
                <span class="material-symbols-outlined">wash</span>
              </div>
              <span className="card-item-text">
                There are currently guests using your bathroom.
              </span>
            </div>
            <div className="card-item">
              <div className="icon-wrapper upcoming-icon-wrapper">
                <span class="material-symbols-outlined">calendar_clock</span>
              </div>
              <span className="card-item-text">
                Monitor 2 upcoming bookings.
              </span>
            </div>
            <div className="card-item">
              <div className="icon-wrapper rate-icon-wrapper">
                <span class="material-symbols-outlined">star</span>
              </div>
              <span className="card-item-text">Rate your past guests</span>
            </div>
          </div>
          <div className="bookings-overview-card-footer">
            <span class="material-symbols-outlined">east</span>
          </div>
        </NavLink>
        <NavLink
          to="/dashboard/bookings/my-booking-history"
          className="bookings-overview-card"
        >
          <div className="bookings-overview-card-header">
            <h2>MY BOOKING HISTORY</h2>
          </div>
          <div className="bookings-overview-card-body">
            <div className="card-item">
              <div className="icon-wrapper active-icon-wrapper">
                <span class="material-symbols-outlined">wash</span>
              </div>
              <span className="card-item-text">
                There are currently guests using your bathroom.
              </span>
            </div>
            <div className="card-item">
              <div className="icon-wrapper upcoming-icon-wrapper">
                <span class="material-symbols-outlined">calendar_clock</span>
              </div>
              <span className="card-item-text">
                Monitor 2 upcoming bookings.
              </span>
            </div>
            <div className="card-item">
              <div className="icon-wrapper rate-icon-wrapper">
                <span class="material-symbols-outlined">star</span>
              </div>
              <span className="card-item-text">Rate your past guests</span>
            </div>
          </div>
          <div className="bookings-overview-card-footer">
            <span class="material-symbols-outlined">east</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
