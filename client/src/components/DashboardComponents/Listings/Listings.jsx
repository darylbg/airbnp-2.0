import React, { useState } from "react";
import { UseSelector, useSelector } from "react-redux";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import "./Listings.css";

export default function Listings() {
  const userListings = useSelector((state) => state.auth.user.user_listings);

  const [dialog, setDialog] = useState(false);

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
            <button>
              <span className="text">Filter</span>
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          <div className="new-listing">
            <button onClick={() => setDialog(true)}>
              <span className="text">New Listing</span>
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <DialogComponent
            className="new-listing-dialog"
            openDialog={dialog}
            closeDialog={() => setDialog(false)}
            icon="close"
          >
            Modal content.
          </DialogComponent>

          <div className="title-text">
            <h3>{userListings.length}</h3>
            <p>listings</p>
          </div>
        </div>
      </div>
      <div className="dashboard-content"></div>
    </>
  );
}
