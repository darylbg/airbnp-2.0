import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import DashboardHeader from "../DashboardHeader/DashboardHeader";
import NewListing from "../../NewListing/NewListing";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import ListingDisplay from "./ListingDisplay/ListingDisplay";
import "./Listings.css";

export default function Listings() {
  const userListings = useSelector((state) => state.auth.user.user_listings);
  console.log("user listings", userListings);

  const [newListingDialog, setNewListingDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);

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
              <span className="text">Sort</span>
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          <DialogComponent
            className="filter-dialog full-width-dialog"
            openDialog={filterDialog}
            closeDialog={() => setFilterDialog(false)}
            icon="close"
            dialogHeader="Filter listings"
          >
            <p className="">filter dialog 2</p>
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
      {/* </div> */}
      <div className="dashboard-body">
        {userListings && userListings.length ? (
          <div className="listings-display">
            {userListings &&
              userListings.map((listing) => (
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
