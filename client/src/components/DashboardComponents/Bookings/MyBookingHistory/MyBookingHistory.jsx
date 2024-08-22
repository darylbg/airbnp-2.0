import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom"; // Correct hook to use
import TableComponent from "../../../PrimitiveComponents/TableComponent/TableComponent";
import TableComponentMobile from "../../../PrimitiveComponents/TableComponentMobile/TableComponentMobile";
import ButtonComponent from "../../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import { GET_USER_BOOKING_HISTORY } from "../../../../utils/queries/bookingsQueries";
import "../GuestReservations/GuestReservations.css";

export default function MyBookingHistory() {
  const [tableData, setTableData] = useState([]);
  const [tableSortBy, setTableSortBy] = useState("All");

  const { openReviewDialog } = useOutletContext(); // Access the function here

  const checkoutSuccess = useSelector(
    (state) => state.bookingCycle.booking.checkoutInfo.checkoutSuccess
  );

  const userId = useSelector((state) => state.auth.currentUser);
  const { loading, error, data } = useQuery(GET_USER_BOOKING_HISTORY, {
    variables: { userId },
  });

  useEffect(() => {
    if (data) {
      setTableData(data.getUserBookingHistory);
    }
  }, [data, checkoutSuccess]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  let windowWidth = window.innerWidth;

  return (
    <div className="dashboard-bookings-content">
      <div className="bookings-table-filter-buttons">
        <ButtonComponent
          action={() => setTableSortBy("Active")}
          type="button"
          className={`default-button table-filter-button ${
            tableSortBy === "Active" ? "selected" : ""
          }`}
        >
          Active
        </ButtonComponent>
        <ButtonComponent
          action={() => setTableSortBy("Upcoming")}
          type="button"
          className={`default-button table-filter-button ${
            tableSortBy === "Upcoming" ? "selected" : ""
          }`}
        >
          Upcoming
        </ButtonComponent>
        <ButtonComponent
          action={() => setTableSortBy("Completed")}
          type="button"
          className={`default-button table-filter-button ${
            tableSortBy === "Completed" ? "selected" : ""
          }`}
        >
          Completed
        </ButtonComponent>
        <ButtonComponent
          action={() => setTableSortBy("All")}
          type="button"
          className={`default-button table-filter-button ${
            tableSortBy === "All" ? "selected" : ""
          }`}
        >
          All
        </ButtonComponent>
      </div>

      <div className="bookings-table-wrapper">
        {windowWidth < 800 ? (
          <TableComponentMobile
            tableSortBy={tableSortBy}
            data={tableData}
            parent="MyBookingHistory"
            openReviewDialog={openReviewDialog} // Pass it here
          />
        ) : (
          <TableComponent
            tableSortBy={tableSortBy}
            data={tableData}
            parent="MyBookingHistory"
            openReviewDialog={openReviewDialog} // Pass it here
          />
        )}
      </div>
    </div>
  );
}
