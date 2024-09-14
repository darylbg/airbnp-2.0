import React, { useState, useCallback } from "react";
import Switch from "react-switch";
import { useMutation } from "@apollo/client";
import { EDIT_LISTING_MUTATION } from "../../../../utils/mutations";
import { updateListing } from "../../../../reducers/userListingsReducer";
import PrimaryButton from "../../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import CrudListing from "../EditListing/EditListing";
import "./ListingDisplay.css";
import DialogComponent from "../../../PrimitiveComponents/DialogComponent/DialogComponent";
import { useDispatch } from "react-redux";

export default function ListingDisplay({ props }) {
  const [editListingDialog, setEditListingDialog] = useState(false);
  const [cancelEditDialog, setCancelEditDialog] = useState(false);
// console.log("listing", props.average_rating?.value)
  // formate date back to 01/01/2001 formate
  const formateDate = (date) => {
    date = new Date(+date);
    const day = String(date.getDate()).padStart(2, 0);
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="listing">
      <div className="listing-header">
        <div className="listing-header-text">
          <span>Set availability of your listing</span>
        </div>
        <SwitchComponent listing={props} />
      </div>
      <div className="listing-body">
        <div className="listing-body-images">
          <div className="first-image">
            <img src={props.listing_image[0]} alt="listing image" />
          </div>
          {props.listing_image.length > 1 ? (
            <div className="multiple-images">
              {props.listing_image.slice(1).map((image, index) => (
                <img key={index} src={image} alt="listing image" />
              ))}
            </div>
          ) : null}
        </div>
        <div className="listing-body-content">
          <h2 className="listing-title">{props.listing_title}</h2>
          <p>{formateDate(props.created_at)}</p>
          <p className="listing-description">{props.listing_description}</p>
          <div className="listing-amenities">
            <p>Amenities</p>
            <ul>
              <li className="listing-amenity"></li>
            </ul>
          </div>
        </div>
        <div className="listing-body-actions">
          <PrimaryButton
            className="default-button secondary-button listing-edit-button"
            action={() => setEditListingDialog(true)}
            type="button"
          >
            Edit Listing
          </PrimaryButton>
          <DialogComponent
            className="edit-listing-dialog full-width-dialog"
            dialogState={editListingDialog}
            closeDialog={() => setCancelEditDialog(true)}
            icon="close"
            dialogHeader={`Editing: ${props.listing_title}`}
            cancelEditDialog={cancelEditDialog}
            setCancelEditDialog={setCancelEditDialog}
            tooltip="Close"
          >
            <CrudListing
              listing={props}
              closeDialog={() => setEditListingDialog(false)}
              cancelEditDialog={cancelEditDialog}
              setCancelEditDialog={setCancelEditDialog}
            />
          </DialogComponent>
          <div className="listing-insights">
            <div className="insights-divider"></div>
            <div className="insight">
              <strong className="insight-number">5</strong>
              <p className="insight-text">Booked</p>
            </div>
            <div className="insight">
              <strong className="insight-number">{props.average_rating?.value.toFixed(1)}</strong>
              <p className="insight-text">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SwitchComponent({ listing }) {
  // const listing = useState((state) => state.userListings.byId); 
  const [checked, setChecked] = useState(listing.availability);
  
  const dispatch = useDispatch();
  const [editListingMutation] = useMutation(EDIT_LISTING_MUTATION);

  const handleAvailabilityToggle = useCallback(async (checked) => {
    console.log("checked", listing)
    try {
      const updatedListing = await editListingMutation({
        variables: {
          listingId: listing.id,
          listingData: {
            listing_title: listing.listing_title,
            listing_description: listing.listing_description,
            contact_method: listing.contact_method,
            listing_image: listing.listing_image,
            fullAddress: listing.fullAddress,
            addressLine1: listing.addressLine1,
            addressLine2: listing.addressLine2,
            addressCity: listing.addressCity,
            addressRegion: listing.addressRegion,
            addressPostCode: listing.addressPostCode,
            latitude: listing.latitude,
            longitude: listing.longitude,
            price: listing.price,
            availability: checked,
          },
        },
      });
      const editedListing = updatedListing.data.updateListing;

      dispatch(updateListing(editedListing));
      setChecked(checked);
    } catch (error) {
      console.log(error);
    }
  });
  return <Switch onChange={handleAvailabilityToggle} checked={checked} />;
}
