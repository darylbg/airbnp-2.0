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
  const [dashboardBookingsSubPage, setDashboardBookingsSubPage] =
    useState("Bookings overview");
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const dropdownMenuToggle = () => {
    // event.stopPropagation();
    console.log("dropdwonmenutoggle running");
    setDropdownMenu(!dropdownMenu);
  };

  const dropdownMenuItemToggle = (item) => {
    // event.stopPropagation();
    setDashboardBookingsSubPage(item);
    setDropdownMenu(false);
  };

  return (
    <>
      <DashboardHeader
        title={dashboardBookingsSubPage}
        subtitle="View your booking history/Guest reservations"
        icon="today"
      >
        <div
          className="dropdown-menu"
          style={{
            borderBottomLeftRadius: !dropdownMenu ? "4px" : "0",
            borderBottomRightRadius: !dropdownMenu ? "4px" : "0",
          }}
        >
          <div className="dropdown-menu-trigger">
            <ButtonComponent
              type="button"
              className="default-button"
              action={dropdownMenuToggle}
            >
              <span>{dashboardBookingsSubPage}</span>
              <span className={`material-symbols-outlined`}>
                {dropdownMenu ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            </ButtonComponent>
          </div>
          {dropdownMenu && (
            <div className="dropdown-menu-content">
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings"
                onClick={() => dropdownMenuItemToggle("Bookings overview")}
                type="button"
              >
                <span>Bookings overview</span>
              </NavLink>
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings/guest-reservations"
                onClick={() => dropdownMenuItemToggle("Guest reservations")}
                type="button"
              >
                <span>Guest reservations</span>
              </NavLink>
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings/my-booking-history"
                onClick={() => dropdownMenuItemToggle("My bookings history")}
                type="button"
              >
                <span>My booking history</span>
              </NavLink>
            </div>
          )}
        </div>
      </DashboardHeader>

      <Outlet />
    </>
  );
}
