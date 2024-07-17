import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import PrimaryButton from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import NewListing from "./NewListing/NewListing";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import ListingDisplay from "./ListingDisplay/ListingDisplay";
import "./Listings.css";
export default function Listings() {
  const userListings = useSelector((state) => state.userListings.byId) || {};
  const [newListingDialog, setNewListingDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("dateAdded");
  const [sortedUserListings, setSortedUserListings] = useState([]);

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
    setFilterDialog(false);
    setSortCriteria(formData.sortCriteria);
  };

  useEffect(() => {
    const listingsArray = Object.values(userListings);

    const sortByDateAdded = () => {
      const sortedArray = [...listingsArray].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setSortedUserListings(sortedArray);
    };

    const sortByAvailability = () => {
      const sortedArray = [...listingsArray].sort((a, b) => {
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
        <div className="listing-header-button-group">
          <PrimaryButton
          className="default-button filter-listings-button"
          action={() => setFilterDialog(true)}
          >
            <span className="text">
              {sortCriteria === "dateAdded"
                ? "Date"
                : sortCriteria === "availability"
                ? "Availability"
                : "Sort"}
            </span>
            <span className="material-symbols-outlined">filter_list</span>
          </PrimaryButton>
          <PrimaryButton
          className="default-button action-button new-listing-button"
          action={() => setNewListingDialog(true)}
          >
            <span className="text">New Listing</span>
            <span className="material-symbols-outlined">add</span>
          </PrimaryButton>
        </div>
        <DialogComponent
          className="filter-dialog content-width-dialog"
          dialogState={filterDialog}
          closeDialog={() => setFilterDialog(false)}
          icon="close"
          dialogHeader="Sort listings"
          backdropClosable={true}
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
              <PrimaryButton
              className="default-button ">Update listings</PrimaryButton>
            </Form.Submit>
          </Form.Root>
        </DialogComponent>
        <DialogComponent
          className="new-listing-dialog full-width-dialog"
          dialogState={newListingDialog}
          closeDialog={() => setNewListingDialog(false)}
          icon="close"
          dialogHeader="Add new listing"
          backdropClosable={false}
        >
          <NewListing closeDialog={() => setNewListingDialog(false)} />
        </DialogComponent>
        <div className="title-text">
          <h3>{Object.keys(userListings).length}</h3>
          <p>listings</p>
        </div>
      </DashboardHeader>
      <div className="dashboard-content-body">
        {/* filter and new listing buttons for mobile devices */}
        <div className="mobile-listing-header-button-group">
          <button
            className="filter-listings"
            onClick={() => setFilterDialog(true)}
          >
            <span className="text">
              {sortCriteria === "dateAdded"
                ? "Date"
                : sortCriteria === "availability"
                ? "Availability"
                : "Sort"}
            </span>
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button
            className="new-listing"
            onClick={() => setNewListingDialog(true)}
          >
            <span className="text">New Listing</span>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* display user listings */}
        {sortedUserListings.length ? (
          <div className="listings-display">
            {sortedUserListings.map((listing) => (
              <ListingDisplay key={listing.id} props={listing} />
            ))}
          </div>
        ) : (
          <Link
            className="no-listings-link"
            onClick={() => setNewListingDialog(true)}
          >
            Add your first listing
          </Link>
        )}
      </div>
    </>
  );
}
