import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApolloError, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import AddressSearch from "../../../AddressSearch/AddressSearch";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import toast from "react-hot-toast";
import ToastComponent from "../../../PrimitiveComponents/ToastComponent/ToastComponent";
import { NEW_LISTING_MUTATION } from "../../../../utils/mutations";
import ImageUploadWidget from "../../../PrimitiveComponents/ImageUploadWidget/ImageUploadWidget";
import { updateUserDetails } from "../../../../reducers/userDetailsReducer";
import { addListing } from "../../../../reducers/userListingsReducer";
import { addToAllListings } from "../../../../reducers/allListingsReducer";
import "./NewListing.css";
import AmenitiesData from "./Amenities.json";
import { useConfirmAddress } from "@mapbox/search-js-react";
import PrimaryButton from "../../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import Spinner from "../../../PrimitiveComponents/Spinner/Spinner";

export default function NewListing({ closeDialog }) {
  const currentUser = useSelector((state) => state.userDetails.byId);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [showFormExpanded, setShowFormExpanded] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);

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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const residenceType = watch("residenceType");

  const [newListingMutation] = useMutation(NEW_LISTING_MUTATION);

  // function to convert images to base64 urls
  const imageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
    });
  };

  const handleNewListing = async (formData, event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const base64URLs = await Promise.all(
        selectedImages.map(async (image) => {
          if (image) {
            return await imageToBase64(image);
          } else {
            return null;
          }
        })
      );

      let listingImages = base64URLs.filter((item) => item !== null);
      let price = +formData.price;
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

      const newListing = await newListingMutation({
        variables: {
          listingData: {
            listing_title: formData.listing_title,
            listing_description: formData.listing_description,
            contact_method: formData.residenceType,
            listing_image: listingImages,
            fullAddress: fullAddress,
            addressLine1: formData.addressAutofillInput,
            addressLine2: formData.addressLine2,
            addressCity: formData.addressCity,
            addressRegion: formData.addressRegion,
            addressPostCode: formData.addressPostCode,
            latitude: formData.addressLatitude,
            longitude: formData.addressLongitude,
            availability: false,
            price: price,
            amenities: amenities,
            payments: [],
            reviews: [],
          },
        },
      });

      // dispatch new listing to redux reducers
      const addedListing = newListing.data.createListing;
      const userListingCount = currentUser.user_listings;
      console.log("addedlisting", addedListing);
      dispatch(addListing(addedListing));
      dispatch(
        updateUserDetails({
          userId: addedListing.user_id,
          updates: { user_listings: userListingCount + 1 },
        })
      );
      dispatch(addToAllListings(addedListing));

      closeDialog();
      setSelectedImages([null, null, null, null, null]);
      setShowFormExpanded(false);
      setShowMinimap(false);
      reset();
      console.log(newListing);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // mapbox
  const { formRef, showConfirm } = useConfirmAddress({
    minimap: true,
    skipConfirmModal: (feature) =>
      ["exact", "high"].includes(feature.properties.match_code.confidence),
  });

  const [amenities, setAmenities] = useState(AmenitiesData); // Track all amenities

  const handleAmenityChange = (amenity) => {
    setAmenities((prevAmenities) =>
      prevAmenities.map(
        (a) =>
          a.name === amenity.name
            ? { ...a, available: !a.available } // Toggle available status
            : a // Keep the other amenities unchanged
      )
    );
  };

  return (
    <div className="new-listing-container">
      <Form.Root
        ref={formRef}
        className="new-listing-form"
        onSubmit={handleSubmit(handleNewListing)}
      >
        <Form.Field className="new-listing-form-field" name="listing_title">
          <Form.Label>listing title</Form.Label>
          <Form.Control asChild>
            <input
              className="input-outlined"
              type="text"
              {...register("listing_title", {
                required: "This is required",
              })}
              disabled={loading}
            />
          </Form.Control>
          <div className="field-message">{errors.listing_title?.message}</div>
        </Form.Field>
        <Form.Field
          className="new-listing-form-field"
          name="listing_description"
        >
          <Form.Label>listing description</Form.Label>
          <Form.Control asChild>
            <textarea
              className="input-outlined"
              type="text"
              {...register("listing_description", {
                required: "This is required",
              })}
              disabled={loading}
            />
          </Form.Control>
          <div className="field-message">
            {errors.listing_description?.message}
          </div>
        </Form.Field>
        <div className="house-type-picker">
          <label>Residence type</label>
          <Form.Field>
            <RadioGroup.Root
              value={residenceType}
              onValueChange={(value) => setValue("residenceType", value)}
              className="RadioGroupRoot"
              defaultValue="Private residence"
              aria-label="View density"
            >
              <div className="house-type-radio">
                <RadioGroup.Item
                  className="RadioGroupItem"
                  value="Private residence"
                  id="r1"
                >
                  <RadioGroup.Indicator className="RadioGroupIndicator" />
                </RadioGroup.Item>
                <label className="Label" htmlFor="r1">
                  Private residence
                </label>
              </div>
              <div className="house-type-radio">
                <RadioGroup.Item
                  className="RadioGroupItem"
                  value="Commercial building"
                  id="r2"
                >
                  <RadioGroup.Indicator className="RadioGroupIndicator" />
                </RadioGroup.Item>
                <label className="Label" htmlFor="r2">
                  Commercial building
                </label>
              </div>
              <div className="house-type-radio">
                <RadioGroup.Item
                  className="RadioGroupItem"
                  value="Other"
                  id="r3"
                >
                  <RadioGroup.Indicator className="RadioGroupIndicator" />
                </RadioGroup.Item>
                <label className="Label" htmlFor="r3">
                  Other
                </label>
              </div>
            </RadioGroup.Root>
          </Form.Field>
        </div>
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
        <AddressSearch
          control={control}
          errors={errors}
          setValue={setValue}
          showFormExpanded={showFormExpanded}
          setShowFormExpanded={setShowFormExpanded}
          showMinimap={showMinimap}
          setShowMinimap={setShowMinimap}
          loading={loading}
          showExpandedAddressSearch={true}
        />
        <div className="amenities-section">
          <h3>Select Amenities</h3>
          {amenities.map((amenity) => (
            <div key={amenity.name}>
              <input
                type="checkbox"
                checked={amenity.available}
                onChange={() => handleAmenityChange(amenity)}
              />
              <label>{amenity.name}</label>
            </div>
          ))}
        </div>
        <Form.Field className="new-listing-form-field" name="price">
          <Form.Label>listing price</Form.Label>
          <Form.Control asChild>
            <input
              className="input-outlined"
              type="number"
              {...register("price", {
                required: "This is required",
              })}
              disabled={loading}
            />
          </Form.Control>
          <div className="field-message">{errors.price?.message}</div>
        </Form.Field>
        <Form.Field className="new-listing-form-field" name="availability">
          <Form.Submit asChild>
            <PrimaryButton
              className="default-button save-button new-listing-save-button"
              type="submit"
              loading={loading}
            >
              Save
              {loading ? <Spinner /> : null}
            </PrimaryButton>
          </Form.Submit>
        </Form.Field>
      </Form.Root>
    </div>
  );
}
