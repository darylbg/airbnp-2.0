import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UseSelector, useSelector } from "react-redux";
import toast from "react-hot-toast";

import NewListing from "../../NewListing/NewListing";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import "./Listings.css";

export default function Listings() {
  const userListings = useSelector((state) => state.auth.user.user_listings);

  const [newListingDialog, setNewListingDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);

  return (
    <>
      <div className="dashboard-header">
        <div className="header-title">
          <div className="title-icon">
            <span className="material-symbols-outlined">list</span>
          </div>
          <div className="title-text">
            <h3>Listings</h3>
            <p>Add, update or delete listings</p>
          </div>
        </div>
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
      </div>
      <div className="dashboard-body">
        {userListings && userListings.length ? (
          <div className="listings-display">listings</div>
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
