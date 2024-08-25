import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  Button,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import ClockComponent from "../ClockComponent/ClockComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useMutation } from "@apollo/client";
import { UPDATE_BOOKING_MUTATION } from "../../../utils/mutations/bookingMutations"; // Make sure to import the mutation

export default function MobileTableComponent({
  data,
  tableSortBy,
  parent,
  openReviewDialog,
  openChatBot
}) {
  const [selected, setSelected] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [UpdateBooking] = useMutation(UPDATE_BOOKING_MUTATION); // Use mutation hook

  useEffect(() => {
    let sorted = [];
    switch (tableSortBy) {
      case "Active":
        sorted = data.filter((row) => row.booking_status === "Active");
        break;
      case "Upcoming":
        sorted = data.filter((row) => row.booking_status === "Upcoming");
        break;
      case "Completed":
        sorted = data.filter((row) => row.booking_status === "Completed");
        break;
      case "All":
      default:
        sorted = data;
        break;
    }
    setSortedData(sorted);

    // Default the first item to be open
    if (sorted.length > 0) {
      setExpandedRows({ [sorted[0].id]: true });
    }
  }, [data, tableSortBy]);

  const handleSelectAllClick = (event) => {
    const checked = event.target.checked;
    if (checked) {
      const newSelecteds = sortedData.filter(
        (row) => row.booking_status !== "Completed"
      );
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const row = sortedData.find((row) => row.id === id);
    if (row.booking_status === "Completed") return; // Do not toggle if status is 'Completed'

    const selectedIndex = selected.findIndex((item) => item.id === id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, row];
    } else {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.some((item) => item.id === id);

  const handleMarkAsComplete = async () => {
    try {
      for (const booking of selected) {
        const updatedBooking = await UpdateBooking({
          variables: {
            bookingId: booking.id,
            bookingInput: {
              booking_status: "Completed",
              booking_status_updated_at: new Date().toISOString(), // Ensure correct date format
              listing: booking.listing.id, // Ensure listing is passed as ID
              guest_id: booking.guest_id,
              host_id: booking.host_id,
              number_of_people: booking.number_of_people,
              arrival_time: booking.arrival_time,
              total_price: booking.total_price,
              payment_status: booking.payment_status,
              special_requests: booking.special_requests,
            },
          },
        });
        console.log("updated booking", updatedBooking);
      }
    } catch (error) {
      console.error("Error updating bookings:", error);
    }
  };

  const handleExpandClick = (event, id) => {
    event.stopPropagation();
    setExpandedRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      <div className="table-controls">
        <div className="table-check-control">
          <Checkbox
            indeterminate={
              selected.length > 0 &&
              selected.length <
                sortedData.filter((row) => row.booking_status !== "Completed")
                  .length
            }
            checked={
              selected.length > 0 &&
              selected.length ===
                sortedData.filter((row) => row.booking_status !== "Completed")
                  .length
            }
            onChange={handleSelectAllClick}
            inputProps={{ "aria-label": "select all" }}
          />
          <ButtonComponent
            disabled={selected.length < 1}
            className="table-control-complete-button default-button"
            action={handleMarkAsComplete}
          >
            <span className="material-symbols-outlined">check</span>
            <span className="text">Mark as complete</span>
          </ButtonComponent>
        </div>
        <div className="table-control-clock">
          <span className="material-symbols-outlined">schedule</span>
          <div className="time-display">
            <ClockComponent />
          </div>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sortedData.map((row) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${row.id}`;
              const isExpanded = !!expandedRows[row.id];
              const isCompleted = row.booking_status === "Completed";
              const isActive = row.booking_status === "Active";
              const arrivalTimeLabel =
                isCompleted || isActive ? "Arrived at" : "Arrival time";
              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" width="100%">
                        <Checkbox
                          checked={isItemSelected || isCompleted}
                          disabled={isCompleted}
                          onClick={(event) =>
                            handleCheckboxClick(event, row.id)
                          }
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                        <Typography>{row.booking_status}</Typography>
                        <Typography>{row.arrival_time}</Typography>
                        <Box marginLeft="auto">
                          <IconButton
                            onClick={(event) =>
                              handleExpandClick(event, row.id)
                            }
                          >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Box>
                          <Typography component="div" className="asdf">
                            <strong>
                              {parent === "GuestReservations" ? "Guest" : "Host"}
                              :
                            </strong>{" "}
                            {row.host_id.display_name}
                          </Typography>
                          <Typography component="div">
                            <strong>Listing reserved:</strong>{" "}
                            {row.listing.listing_title}
                          </Typography>
                          <Typography component="div">
                            <strong>{arrivalTimeLabel}:</strong>{" "}
                            {row.arrival_time}
                          </Typography>
                          <Typography component="div">
                            <strong>Number of people:</strong>{" "}
                            {row.number_of_people}
                          </Typography>
                          <Typography component="div">
                            <strong>Total Price:</strong> $
                            {row.total_price.toFixed(2)}
                          </Typography>
                          <Typography component="div">
                            <strong>Payment Status:</strong>{" "}
                            {row.payment_status}
                          </Typography>
                          <Typography component="div">
                            <strong>Special Requests:</strong>{" "}
                            {row.special_requests}
                          </Typography>
                          <Typography component="div">
                            <strong>Status updated:</strong>{" "}
                            {row.booking_status_updated_at}
                          </Typography>

                          <Typography component="div">
                          <strong>Contact {parent === "MyBookingHistory" ? "Host" : "Guest"}</strong>{" "}
                          <ButtonComponent
                            className="default-button contact-review-button"
                            type="button"
                            action={() =>
                              row.booking_status === "Completed"
                                ? openReviewDialog(
                                    row.listing,
                                    parent === "MyBookingHistory"
                                      ? row.host_id
                                      : row.guest_id,
                                    parent
                                  )
                                : openChatBot(row)
                            }
                          >
                            {row.booking_status === "Completed" ? (
                              <>
                                <span>Leave a review</span>
                                <span className="material-symbols-outlined">
                                  star
                                </span>
                              </>
                            ) : (
                              <>
                                <span>
                                  Chat with{" "}
                                  {parent === "MyBookingHistory"
                                    ? "Host"
                                    : "Guest"}
                                </span>
                                <span className="material-symbols-outlined">
                                  forum
                                </span>
                              </>
                            )}
                          </ButtonComponent>
                          </Typography>
                          
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
