import React, { useEffect, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import "./Bookings.css";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";

export default function Bookings() {
  const [headingTitle, setHeadingTitle] = useState("Bookings overview");
  const [headingSubTitle, setHeadingSubTitle] = useState("View your bookings");
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);

  const openReviewDialog = () => {
    console.log("opened");
    setReviewDialog(true);
  };

  const closeReviewDialog = () => {
    setReviewDialog(false);
  };

  const dropdownMenuToggle = () => {
    setDropdownMenu(!dropdownMenu);
  };

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/")[3];
    if (path === "guest-reservations") {
      setHeadingTitle("Guest Reservations");
      setHeadingSubTitle("Manage reservations to your listings");
    } else if (path === "my-booking-history") {
      setHeadingTitle("My Booking History");
      setHeadingSubTitle("View your bookings");
    } else {
      setHeadingTitle("Bookings Overview");
      setHeadingSubTitle("Manage guest reservations and your bookings");
    }
  }, [location]);

  return (
    <>
      <DashboardHeader
        title={headingTitle}
        subtitle={headingSubTitle}
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
              <span>{headingTitle}</span>
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
                onClick={dropdownMenuToggle}
                type="button"
              >
                <span>Bookings overview</span>
              </NavLink>
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings/guest-reservations"
                onClick={dropdownMenuToggle}
                type="button"
              >
                <span>Guest reservations</span>
              </NavLink>
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings/my-booking-history"
                onClick={dropdownMenuToggle}
                type="button"
              >
                <span>My booking history</span>
              </NavLink>
            </div>
          )}
        </div>
      </DashboardHeader>
      <Outlet context={{ openReviewDialog }} />
      <DialogComponent
        className="content-width-dialog review-dialog"
        dialogState={reviewDialog}
        closeDialog={closeReviewDialog}
        dialogHeader="Leave a review"
        icon="close"
        backdropClosable={true}
        minimize={false}
      >
        leave a review
      </DialogComponent>
    </>
  );
}
