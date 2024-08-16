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

export default function MobileTableComponent({ data, tableSortBy }) {
  const [selected, setSelected] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

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
    if (event.target.checked) {
      const newSelecteds = sortedData
        .filter((row) => row.booking_status !== "Completed")
        .map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const row = sortedData.find((row) => row.id === id);
    if (row.booking_status === "Completed") return; // Do not toggle if status is 'Completed'

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
            loading={selected.length < 1}
            className="table-control-complete-button default-button"
            action={handleMarkAsComplete}
          >
            <span class="material-symbols-outlined">check</span>
            <span className="text">Mark as complete</span>
          </ButtonComponent>
        </div>
        <div className="table-control-clock">
          <span class="material-symbols-outlined">schedule</span>
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
                          <Typography component="div">
                            <strong>Hosted by:</strong>{" "}
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
