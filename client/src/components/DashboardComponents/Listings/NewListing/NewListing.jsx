import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApolloError, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import AddressSearch from "../../../AddressSearch/AddressSearch";
import * as Form from "@radix-ui/react-form";
import toast from "react-hot-toast";
import ToastComponent from "../../../PrimitiveComponents/ToastComponent/ToastComponent";
import { NEW_LISTING_MUTATION } from "../../../../utils/mutations";
import ImageUploadWidget from "../../../PrimitiveComponents/ImageUploadWidget/ImageUploadWidget";
import {updateUserDetails} from "../../../../reducers/userDetailsReducer";
import {addListing} from "../../../../reducers/userListingsReducer"
import "./NewListing.css";

export default function NewListing({closeDialog}) {
  const currentUser = useSelector((state) => state.userDetails.byId);
  const [selectedImages, setSelectedImages] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  // console.log(selectedImages);
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
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

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

      let listingImages = base64URLs.filter(item => item !== null);
      let price = +formData.price;
      const newListing = await newListingMutation({
        variables: {
          listingData: {
            listing_title: formData.listing_title,
            listing_description: formData.listing_description,
            contact_method: formData.contact_method,
            listing_image: listingImages,
            address: formData.address,
            // lat and long will be dynamically address when geolocation is added
            latitude: 10,
            longitude: 11,
            availability: false,
            price: price,
            amenities: [],
            payments: [],
            reviews: []
          },
        },
      });

      // dispatch new listing to redux reducers
      const addedListing = newListing.data.createListing;
      const userListingCount = currentUser.user_listings;

      dispatch(addListing(addedListing));
      dispatch(updateUserDetails({ userId: addedListing.user_id, updates: { user_listings: userListingCount + 1 } }));
      
      closeDialog();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="new-listing-container">
      <Form.Root
        className="new-listing-form"
        onSubmit={handleSubmit(handleNewListing)}
      >
        <Form.Field className="new-listing-form-field" name="listing_title">
          <Form.Label>listing title</Form.Label>
          <Form.Control asChild>
            <input
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
          <Form.Label>listing description</Form.Label>
          <Form.Control asChild>
            <textarea
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
          <Form.Label>listing contact method</Form.Label>
          <Form.Control asChild>
            <textarea
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
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="field-message">{errors.listing_image?.message}</div>
        </Form.Field>
        <Form.Field className="new-listing-form-field" name="address">
          <Form.Label>listing address</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("address", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <AddressSearch />
          <div className="field-message">{errors.address?.message}</div>
        </Form.Field>
        <Form.Field
          className="new-listing-form-field price-form-field"
          name="price"
        >
          <Form.Label>listing price</Form.Label>
          <Form.Control asChild>
            <input
              type="number"
              {...register("price", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.price?.message}</div>
        </Form.Field>
        <Form.Field className="new-listing-form-field" name="availability">
          <Form.Submit asChild>
            <button>add new listing</button>
          </Form.Submit>
        </Form.Field>
      </Form.Root>
    </div>
  );
}
