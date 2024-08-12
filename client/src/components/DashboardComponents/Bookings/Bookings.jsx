import React, { useRef, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AddressSearch from "../../AddressSearch/AddressSearch";
import PrimaryButton from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./Bookings.css";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import { NavLink, Outlet } from "react-router-dom";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Bookings() {
  const [bookingsPage, setBookingsPage] = useState("Bookings overview");

  // dropdown with MyBookingHistory and GuestBookings
  // my booking history with current bookings/ past bookings / all bookings / saved bookings
  // guest bookings with upcoming/currently hosting/all

  return (
    <>
      <DashboardHeader
        title={bookingsPage}
        subtitle="View your booking history/Guest reservations"
        icon="today"
      >
        <div className="booking-page-menu-dropdown">
          <DropdownMenu.Root className="">
            <DropdownMenu.Trigger asChild>
              <button className="default-button white-button">
                <span>{bookingsPage}</span>
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                side="bottom"
                align="start"
                sideOffset={5}
                className="dropdown-menu-content"
              >
                <DropdownMenu.Item className="dropdown-menu-item">
                  <NavLink
                    to="/dashboard/bookings"
                    onClick={() => setBookingsPage("Bookings overview")}
                  >
                    Bookings overview
                  </NavLink>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-menu-item">
                  <NavLink
                    to="/dashboard/bookings/guest-reservations"
                    onClick={() => setBookingsPage("Guest reservations")}
                  >
                    Guest Reservations
                  </NavLink>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-menu-item">
                  <NavLink
                    to="/dashboard/bookings/my-booking-history"
                    onClick={() => setBookingsPage("My booking history")}
                  >
                    My booking history
                  </NavLink>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </DashboardHeader>
      <div>
        <Outlet>
          <NavLink to="/guest-reservations">guest reservations</NavLink>
          <NavLink to="/my-booking-history">My booking history</NavLink>
        </Outlet>
      </div>
    </>
  );
}
