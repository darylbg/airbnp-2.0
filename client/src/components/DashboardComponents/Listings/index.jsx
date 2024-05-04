import React from "react";
import { UseSelector, useSelector } from "react-redux";
import * as Dialog from "@radix-ui/react-dialog";
import WindowControlButton from "../../WindowControlButton";
import "./Listings.css";

export default function Listings() {
  const userListings = useSelector((state) => state.auth.user.user_listings);
  console.log(userListings);
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
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button>
                  <span className="text">New Listing</span>
                  <span className="material-symbols-outlined">add</span>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="listingDialogOverlay">
                  <Dialog.Content className="listingDialogContent">
                  <Dialog.Close asChild>
                    {/* <button>close</button> */}
                    <WindowControlButton />
                  </Dialog.Close>
                    dialoge
                    <div>hello dialog</div>
                  </Dialog.Content>
                </Dialog.Overlay>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
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
