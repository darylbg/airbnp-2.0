import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper,
  Avatar,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Clock from 'react-clock';
import "./TableComponent.css";

export default function TableComponent({ data, tableSortBy, parent }) {
  const [selected, setSelected] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [value, setValue] = useState(new Date());

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
  }, [data, tableSortBy]);

  const handleSelectAllClick = (event) => {
    const checked = event.target.checked;
    if (checked) {
      // Select all items that are not completed
      const newSelecteds = sortedData
        .filter((row) => row.booking_status !== "Completed")
        .map((n) => n.id);
      setSelected(newSelecteds);
    } else {
      // Unselect all items
      setSelected([]);
    }
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation(); // Prevent row click from being triggered

    // Do not toggle selection if status is 'Completed'
    const row = sortedData.find((row) => row.id === id);
    if (row.booking_status === "Completed") return;

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleMarkAsComplete = () => {
    console.log("Selected rows:", selected);
  };
  
  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="table-controls">
        <Button
          disabled={selected.length < 1}
          className="table-control-complete-button"
          onClick={handleMarkAsComplete}
        >
          <span class="material-symbols-outlined">check</span>
          <span className="text">Mark as complete</span>
        </Button>
        <div className="table-control-clock">
          <span class="material-symbols-outlined">schedule</span>
          <div className="time-display"><Clock value={value} />10:15</div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 &&
                    selected.length <
                      sortedData.filter(
                        (row) => row.booking_status !== "Completed"
                      ).length
                  }
                  checked={
                    selected.length > 0 &&
                    selected.length ===
                      sortedData.filter(
                        (row) => row.booking_status !== "Completed"
                      ).length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                {" "}
                {(() => {
                  if (parent === "GuestReservations") {
                    return "Guest";
                  } else if (parent === "MyBookingHistory") {
                    return "Hosted by";
                  }
                })()}
              </TableCell>
              <TableCell>Listing reserved</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Arrival time</TableCell>
              <TableCell>Number of people</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Special Requests</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData?.map((row) => {
              if (sortedData.length < 1) {
                console.log("no data")
                return (<span>no bookings</span>);
              }
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${row.id}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        isItemSelected || row.booking_status === "Completed"
                      }
                      disabled={row.booking_status === "Completed"}
                      onClick={(event) => handleCheckboxClick(event, row.id)}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.host_id.display_name}
                  </TableCell>
                  <TableCell>
                    {parent === "MyBookingHistory" ? (
                      <NavLink to={row.listing_url}>
                        {row.listing.listing_title}
                      </NavLink>
                    ) : (
                      <>{row.listing.listing_title}</>
                    )}
                  </TableCell>
                  <TableCell>{row.booking_status}</TableCell>
                  <TableCell>{row.arrival_time}</TableCell>
                  <TableCell>{row.number_of_people}</TableCell>
                  <TableCell>${row.total_price.toFixed(2)}</TableCell>
                  <TableCell>{row.payment_status}</TableCell>
                  <TableCell>{row.special_requests}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
