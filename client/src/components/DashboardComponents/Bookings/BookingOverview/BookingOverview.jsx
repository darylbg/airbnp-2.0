import React from "react";
import { NavLink } from "react-router-dom";
import "./BookingOverview.css";

export default function BookingOverview({ }) {
  return (
    <div className="booking-overview-content">
      <div className="booking-overview-cards">
        <NavLink
          // onClick={() => setDashboardBookingsSubPage("Guest reservations")}
          to="/dashboard/bookings/guest-reservations"
          className="booking-overview-card"
        >
          <div className="booking-overview-card-header">
            <h2>GUEST RESERVATIONS</h2>
          </div>
          <div className="booking-overview-card-body">
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
          <div className="booking-overview-card-footer">
            <span class="material-symbols-outlined">east</span>
          </div>
        </NavLink>
        <NavLink
          // onClick={() => setDashboardBookingsSubPage("My booking history")}
          to="/dashboard/bookings/my-booking-history"
          className="booking-overview-card"
        >
          <div className="booking-overview-card-header">
            <h2>MY BOOKING HISTORY</h2>
          </div>
          <div className="booking-overview-card-body">
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
          <div className="booking-overview-card-footer">
            <span class="material-symbols-outlined">east</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
