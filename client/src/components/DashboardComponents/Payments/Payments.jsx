import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import { useQuery } from "@apollo/client";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import {
  GET_USER_GUEST_RESERVATIONS,
  GET_USER_BOOKING_HISTORY,
} from "../../../utils/queries/bookingsQueries";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export default function Payments() {
  const [tableDataAll, setTableDataAll] = useState([]);
  const [tableDataIncoming, setTableDataIncoming] = useState([]);
  const [tableDataOutgoing, setTableDataOutgoing] = useState([]);
  const [tableSortBy, setTableSortBy] = useState("All");
  const [paymentsBalance, setPaymentsBalance] = useState(0);

  console.log("sort by", tableSortBy);

  const checkoutSuccess = useSelector(
    (state) => state.bookingCycle.booking.checkoutInfo.checkoutSuccess
  );

  const userId = useSelector((state) => state.auth.currentUser);

  // Query for user guest reservations
  const {
    loading: loadingGuestReservations,
    error: errorGuestReservations,
    data: dataGuestReservations,
  } = useQuery(GET_USER_GUEST_RESERVATIONS, {
    variables: { userId },
  });

  // Query for user booking history
  const {
    loading: loadingBookingHistory,
    error: errorBookingHistory,
    data: dataBookingHistory,
  } = useQuery(GET_USER_BOOKING_HISTORY, {
    variables: { userId },
  });

  useEffect(() => {
    if (dataGuestReservations) {
      setTableDataIncoming(dataGuestReservations.getUserGuestReservations);
    }
    if (dataBookingHistory) {
      setTableDataOutgoing(dataBookingHistory.getUserBookingHistory);
    }
    if (dataGuestReservations || dataBookingHistory) {
      const allData = [
        ...(dataGuestReservations?.getUserGuestReservations || []),
        ...(dataBookingHistory?.getUserBookingHistory || []),
      ]
      setTableDataAll(allData);
      calculatePaymentsBalance(allData);
    }

    
  }, [dataGuestReservations, dataBookingHistory, checkoutSuccess]);

  const calculatePaymentsBalance = (data) => {
    console.log("running payment calc");
    if (data) {
      const balance = data.reduce((acc, booking) => {
        if (booking.guest_id === userId) {
          console.log("minus")
          return acc - booking.total_price;
        }
        return acc + booking.total_price;
      }, 0); 
  
      setPaymentsBalance(balance);
    }
  };

  // Function to get the filtered data based on tableSortBy state
  const getFilteredData = () => {
    switch (tableSortBy) {
      case "Incoming":
        return tableDataIncoming;
      case "Outgoing":
        return tableDataOutgoing;
      case "All":
      default:
        return tableDataAll;
    }
  };

  // loading handling
  if (loadingGuestReservations || loadingBookingHistory) {
    return <p>Loading...</p>;
  }

  // error handling
  if (errorGuestReservations) {
    return (
      <p>Error fetching guest reservations: {errorGuestReservations.message}</p>
    );
  }
  if (errorBookingHistory) {
    return <p>Error fetching booking history: {errorBookingHistory.message}</p>;
  }

  const filteredData = getFilteredData();

  return (
    <>
      <DashboardHeader
        title="Payments"
        subtitle="Manage your payments"
        icon="payments"
      >
        <span>£{paymentsBalance.toFixed(2)}</span>
      </DashboardHeader>
      <div className="dashboard-bookings-content">
        <div className="bookings-table-filter-buttons">
          <ButtonComponent
            action={() => setTableSortBy("Incoming")}
            type="button"
            className={`default-button table-filter-button ${
              tableSortBy === "Incoming" ? "selected" : ""
            }`}
          >
            Incoming
          </ButtonComponent>
          <ButtonComponent
            action={() => setTableSortBy("Outgoing")}
            type="button"
            className={`default-button table-filter-button ${
              tableSortBy === "Outgoing" ? "selected" : ""
            }`}
          >
            Outgoing
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
        <div className="payments-table-wrapper">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((booking, index) => (
                  <TableRow key={`${booking.id}-${index}`}>
                    <TableCell>
                      {new Date(parseInt(booking.created_at)).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {booking.guest_id === userId ? (
                        <>
                          {" "}
                          <span>Booked</span>{" "}
                          <a
                            href={booking.listing_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {booking.listing.fullAddress}
                          </a>
                        </>
                      ) : booking.host_id === userId ? (
                        <span>Payment for listing</span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {booking.guest_id === userId
                        ? (booking.total_price * -1).toFixed(2)
                        : booking.total_price.toFixed(2)}
                    </TableCell>
                    <TableCell>{booking.guest_id ? "Guest" : "Host"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}
