import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { useMutation } from "@apollo/client";
import { EDIT_LISTING_MUTATION } from "../../../../utils/mutations";
import { DELETE_LISTING_MUTATION } from "../../../../utils/mutations";
import ImageUploadWidget from "../../../PrimitiveComponents/ImageUploadWidget/ImageUploadWidget";
import {
  updateListing,
  deleteListing,
} from "../../../../reducers/userListingsReducer";
import { removeFromAllListings } from "../../../../reducers/allListingsReducer";
import DialogComponent from "../../../PrimitiveComponents/DialogComponent/DialogComponent";
import { useConfirmAddress } from "@mapbox/search-js-react";
import { updateUserDetails } from "../../../../reducers/userDetailsReducer";
import AddressSearch from "../../../AddressSearch/AddressSearch";
import toast from "react-hot-toast";
import ToastComponent from "../../../PrimitiveComponents/ToastComponent/ToastComponent";
import PrimaryButton from "../../../PrimitiveComponents/PrimaryButton/PrimaryButton";
import "./EditListing.css";
import Spinner from "../../../PrimitiveComponents/Spinner/Spinner";
import WindowControlButton from "../../../PrimitiveComponents/WindowControlButton/WindowControlButton";

export default function EditListing({
  listing,
  closeDialog,
  cancelEditDialog,
  setCancelEditDialog,
}) {
  const currentUser = useSelector((state) => state.userDetails.byId);

  const [loading, setLoading] = useState(false);
  const [showFormExpanded, setShowFormExpanded] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [deleteListingDialog, setDeleteListingDialog] = useState(false);

  // spread in lisitng images or fill array length up to 5 with null
  const initialImages = Array.from(
    { length: 5 },
    (_, i) => listing.listing_image[i] || null
  );
  const [selectedImages, setSelectedImages] = useState(initialImages);
  const dispatch = useDispatch();

  const handleImageSelect = (image, index) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = image;
      return newImages;
    });
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages[index] = null;
    setSelectedImages(updatedImages);
  };

  // function to convert images to base64 urls
  const imageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
    });
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listing_title: listing.listing_title,
      listing_description: listing.listing_description,
      contact_method: listing.contact_method,
      fullAddress: listing.fullAddress,
      addressLine1: listing.addressAutofillInput,
      addressLine2: listing.addressLine2,
      addressCity: listing.addressCity,
      addressRegion: listing.addressRegion,
      addressPostCode: listing.addressPostCode,
      latitude: listing.latitude,
      longitude: listing.longitude,
      price: listing.price,
    },
  });

  const [editListingMutation] = useMutation(EDIT_LISTING_MUTATION);
  const [deleteListingMutation] = useMutation(DELETE_LISTING_MUTATION);

  const handleUpdatingListing = async (formData, event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formDataImages = selectedImages.filter((img) => img);
      const listingImages = await Promise.all(
        formDataImages.map(async (image) => {
          if (image instanceof File) {
            // Convert image to base64
            return await imageToBase64(image);
          } else {
            // Already a Cloudinary string
            return image;
          }
        })
      );

      let addressComponents = [
        formData.addressAutofillInput,
        formData.addressLine2,
        formData.addressCity,
        formData.addressRegion,
        formData.addressPostCode,
      ];

      let fullAddress = addressComponents
        .filter((component) => component && component.trim() !== "")
        .join(", ");

      const updatedListing = await editListingMutation({
        variables: {
          listingId: listing.id,
          listingData: {
            listing_title: formData.listing_title,
            listing_description: formData.listing_description,
            contact_method: formData.contact_method,
            listing_image: listingImages,
            fullAddress: fullAddress,
            addressLine1: formData.addressAutofillInput,
            addressLine2: formData.addressLine2,
            addressCity: formData.addressCity,
            addressRegion: formData.addressRegion,
            addressPostCode: formData.addressPostCode,
            latitude: formData.latitude,
            longitude: formData.longitude,
            price: +formData.price,
          },
        },
      });

      const editedListing = updatedListing.data.updateListing;

      dispatch(updateListing(editedListing));
      setShowFormExpanded(false);
      setShowMinimap(false);
      closeDialog();
      toast.success(<ToastComponent message="Successfully updated listing." />);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (event) => {
    event.preventDefault();
    try {
      const deletedListing = await deleteListingMutation({
        variables: { listingId: listing.id },
      });

      const userListingCount = currentUser.user_listings;

      dispatch(
        updateUserDetails({
          userId: currentUser.id,
          update: { user_listings: userListingCount - 1 },
        })
      );
      dispatch(deleteListing(listing.id));
      dispatch(removeFromAllListings(listing.id));
      console.log("deleted listing", deletedListing);
      closeDialog();
    } catch (error) {
      console.log(error);
    }
  };

  // mapbox
  const { formRef, showConfirm } = useConfirmAddress({
    minimap: true,
    skipConfirmModal: (feature) =>
      ["exact", "high"].includes(feature.properties.match_code.confidence),
  });

  // cancel post editing and close the editing check pop up
  const handleCancelEdit = (e) => {
    e.preventDefault();
    closeDialog();
    setCancelEditDialog(false);
  };

  return (
    <>
      <Form.Root
        className="new-listing-form"
        onSubmit={handleSubmit(handleUpdatingListing)}
        ref={formRef}
      >
        <p>{listing.listing_title}</p>
        <Form.Field className="new-listing-form-field" name="listing_title">
          <Form.Label>Listing Title</Form.Label>
          <Form.Control asChild>
            <input
              disabled={loading}
              type="text"
              {...register("listing_title", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.listing_title?.message}</div>
        </Form.Field>
        <Form.Field
          className="new-listing-form-field"
          name="listing_description"
        >
          <Form.Label>Listing Description</Form.Label>
          <Form.Control asChild>
            <textarea
              disabled={loading}
              type="text"
              {...register("listing_description", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">
            {errors.listing_description?.message}
          </div>
        </Form.Field>
        <Form.Field className="new-listing-form-field" name="contact_method">
          <Form.Label>Contact Method</Form.Label>
          <Form.Control asChild>
            <textarea
              disabled={loading}
              type="text"
              {...register("contact_method", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.contact_method?.message}</div>
        </Form.Field>
        <Form.Field className="new-listing-form-field" name="listing_image">
          <Form.Label>Listing Images</Form.Label>
          <div className="image-upload-widgets">
            <div className="first-image-widget">
              <ImageUploadWidget
                index={0}
                image={selectedImages[0]}
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                loading={loading}
              />
            </div>
            <div className="other-upload-widgets-grid">
              {selectedImages.slice(1).map((image, index) => (
                <div key={index + 1} className="image-upload-widget-container">
                  <ImageUploadWidget
                    index={index + 1}
                    image={image}
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                    loading={loading}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="field-message">{errors.listing_image?.message}</div>
        </Form.Field>
        <div className="address-display">{listing.fullAddress}</div>
        <Form.Field className="new-listing-form-field" name="address">
          <Form.Label>Enter new address</Form.Label>
          <AddressSearch
            control={control}
            errors={errors}
            setValue={setValue}
            showFormExpanded={showFormExpanded}
            setShowFormExpanded={setShowFormExpanded}
            showMinimap={showMinimap}
            setShowMinimap={setShowMinimap}
            listing={listing}
          />
          <div className="field-message">{errors.address?.message}</div>
        </Form.Field>
        <Form.Field
          className="new-listing-form-field price-form-field"
          name="price"
        >
          <Form.Label>Listing Price</Form.Label>
          <Form.Control asChild>
            <input
              disabled={loading}
              type="number"
              {...register("price", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.price?.message}</div>
        </Form.Field>
        <div className="edit-listing-button-group">
          <PrimaryButton
            className="delete-button"
            type="button"
            action={() => {
              setDeleteListingDialog(true);
            }}
            loading={loading}
          >
            Delete listing
          </PrimaryButton>
          <Form.Field className="new-listing-form-field" name="availability">
            <Form.Submit asChild>
              <PrimaryButton
                className="save-button"
                type="submit"
                loading={loading}
              >
                Update listing
                {loading ? <Spinner /> : null}
              </PrimaryButton>
            </Form.Submit>
          </Form.Field>
        </div>
      </Form.Root>

      {/* cancel listing confirmation dialog */}
      <DialogComponent
        dialogState={cancelEditDialog}
        dialogHeader="Cancel edits"
        backdropClosable={false}
        className="content-width-dialog cancel-edit-dialog"
      >
        <div className="text">If you close this you will lose edites.</div>
        <div className="button-group">
          <PrimaryButton
            type="button"
            action={() => setCancelEditDialog(false)}
            className="cancel-button"
          >
            Continue editing
          </PrimaryButton>
          <PrimaryButton
            className="delete-button"
            type="button"
            action={handleCancelEdit}
          >
            Yes cancel edits
          </PrimaryButton>
        </div>
      </DialogComponent>

      {/* delete listing confirmation dialog */}
      <DialogComponent
        dialogState={deleteListingDialog}
        dialogHeader="Delete listing"
        backdropClosable={false}
        className="content-width-dialog delete-listing-dialog"
      >
        <div className="text">are you sure you want to delete listing</div>
        <div className="button-group">
          <PrimaryButton
            type="button"
            action={() => setDeleteListingDialog(false)}
            className="cancel-button"
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            className="delete-button"
            type="button"
            action={handleDeleteListing}
          >
            Yes delete listing
          </PrimaryButton>
        </div>
      </DialogComponent>
    </>
  );
}
