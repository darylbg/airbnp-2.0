import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { useMutation } from "@apollo/client";
import { EDIT_LISTING_MUTATION } from "../../../../utils/mutations";
import ImageUploadWidget from "../../../PrimitiveComponents/ImageUploadWidget/ImageUploadWidget";
import { updateListing } from "../../../../reducers/userListingsReducer";

export default function EditListing({ listing }) {
  const currentUser = useSelector((state) => state.userDetails.byId);
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
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listing_title: listing.listing_title,
      listing_description: listing.listing_description,
      contact_method: listing.contact_method,
      address: listing.address,
      latitude: listing.latitude,
      longitude: listing.longitude,
      availability: listing.availability,
      price: listing.price,
    },
  });

  const [editListingMutation] = useMutation(EDIT_LISTING_MUTATION);

  const handleNewListing = async (formData, event) => {
    event.preventDefault();
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

      const updatedListing = await editListingMutation({
        variables: {
          listingId: listing.id,
          listingData: {
            listing_title: formData.listing_title,
            listing_description: formData.listing_description,
            contact_method: formData.contact_method,
            listing_image: listingImages,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
            availability: formData.availability,
            price: +formData.price,
          },
        },
      });
      console.log("successfully updated", updatedListing);
      const editedListing = updatedListing.data.updateListing;
      console.log(editedListing.id);
      dispatch(updateListing(editedListing));
      // dispatch(
      //   updateUserDetails({
      //     userId: addedListing.user_id,
      //     updates: { user_listings: userListingCount + 1 },
      //   })
      // );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form.Root
      className="new-listing-form"
      onSubmit={handleSubmit(handleNewListing)}
    >
      <p>{listing.listing_title}</p>
      <Form.Field className="new-listing-form-field" name="listing_title">
        <Form.Label>Listing Title</Form.Label>
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
      <Form.Field className="new-listing-form-field" name="listing_description">
        <Form.Label>Listing Description</Form.Label>
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
        <Form.Label>Contact Method</Form.Label>
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
        <Form.Label>Listing Address</Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            {...register("address", {
              required: "This is required",
            })}
          />
        </Form.Control>
        <div className="field-message">{errors.address?.message}</div>
      </Form.Field>
      <Form.Field
        className="new-listing-form-field price-form-field"
        name="price"
      >
        <Form.Label>Listing Price</Form.Label>
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
          <button>Update Listing</button>
        </Form.Submit>
      </Form.Field>
    </Form.Root>
  );
}
