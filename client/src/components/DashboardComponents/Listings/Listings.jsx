import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";

import DashboardHeader from "../DashboardHeader/DashboardHeader";
import NewListing from "./NewListing/NewListing";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import ListingDisplay from "./ListingDisplay/ListingDisplay";
import "./Listings.css";
import PrimaryButton from "../../PrimitiveComponents/PrimaryButton/PrimaryButton";

export default function Listings() {
  const userListings = useSelector((state) => state.userListings.byId);
  const [newListingDialog, setNewListingDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("dateAdded");
  const [sortedUserListings, setSortedUserListings] = useState([
    ...userListings,
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sortCriteria: "dateAdded",
    },
  });

  const handleListingsSort = (formData) => {
    console.log("sort form data", formData);
    setFilterDialog(false);
    setSortCriteria(formData.sortCriteria);
  };

  useEffect(() => {
    const sortByDateAdded = () => {
      const sortedArray = [...userListings].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setSortedUserListings(sortedArray);
    };

    const sortByAvailability = () => {
      const sortedArray = [...userListings].sort((a, b) => {
        if (a.availability !== b.availability) {
          return b.availability - a.availability;
        } else {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      });
      setSortedUserListings(sortedArray);
    };

    switch (sortCriteria) {
      case "dateAdded":
        sortByDateAdded();
        break;
      case "availability":
        sortByAvailability();
        break;
      default:
        break;
    }
  }, [sortCriteria, userListings]);

  return (
    <>
      <DashboardHeader
        title="Listings"
        subtitle="Manage your listings"
        icon="list"
      >
        <div className="header-content">
          <div className="filter-listings">
            <button onClick={() => setFilterDialog(true)}>
              <span className="text">
                {sortCriteria === "dateAdded"
                  ? "Date"
                  : sortCriteria === "availability"
                  ? "Availability"
                  : "Sort"}
              </span>
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          <DialogComponent
            className="filter-dialog content-width-dialog"
            openDialog={filterDialog}
            closeDialog={() => setFilterDialog(false)}
            icon="close"
            dialogHeader="Sort listings"
          >
            <Form.Root
              className="user-listings-sort-form"
              onSubmit={handleSubmit(handleListingsSort)}
            >
              <Form.Field className="user-listings-sort-field">
                <Form.Control asChild>
                  <input
                    name="sort-radio"
                    value="dateAdded"
                    {...register("sortCriteria")}
                    type="radio"
                  />
                </Form.Control>
                <Form.Label>Date added</Form.Label>
              </Form.Field>
              <Form.Field className="user-listings-sort-field">
                <Form.Control asChild>
                  <input
                    name="sort-radio"
                    value="availability"
                    {...register("sortCriteria")}
                    type="radio"
                  />
                </Form.Control>
                <Form.Label>Availability</Form.Label>
              </Form.Field>
              <Form.Submit asChild>
                <PrimaryButton>Update listings</PrimaryButton>
              </Form.Submit>
            </Form.Root>
          </DialogComponent>
          <div className="new-listing">
            <button onClick={() => setNewListingDialog(true)}>
              <span className="text">New Listing</span>
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <DialogComponent
            className="new-listing-dialog full-width-dialog"
            openDialog={newListingDialog}
            closeDialog={() => setNewListingDialog(false)}
            icon="close"
            dialogHeader="Add new listing"
          >
            <NewListing />
          </DialogComponent>
          <div className="title-text">
            <h3>{userListings.length}</h3>
            <p>listings</p>
          </div>
        </div>
      </DashboardHeader>
      <div className="dashboard-content-body">
        {sortedUserListings && sortedUserListings.length ? (
          <div className="listings-display">
            {sortedUserListings &&
              sortedUserListings.map((listing) => (
                <ListingDisplay key={listing.id} props={listing} />
              ))}
          </div>
        ) : (
          <Link
            className="no-listings-link"
            onClick={() => setNewListingDialog(true)}
          >
            add your first listing
          </Link>
        )}
      </div>
    </>
  );
}
