import React from "react";
import { useDispatch } from "react-redux";
import { ApolloError, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import toast from "react-hot-toast";
import ToastComponent from "../PrimitiveComponents/ToastComponent/ToastComponent";
import { NEW_LISTING_MUTATION } from "../../utils/mutations";
import "./NewListing.css";

export default function NewListing() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [newListingMutation] = useMutation(NEW_LISTING_MUTATION);

  const handleNewListing = async (formData, event) => {
    event.preventDefault();
    try {
      console.log(formData);
      const newListing = await newListingMutation({
        variables: {
          listingData: {
            listing_title: formData.listing_title,
            listing_description: formData.listing_description,
            contact_method: formData.contact_method,
            listing_image: formData.listing_image,
            address: formData.address,
            // lat and long will be dynamically address when geolocation is added
            latitude: 10,
            longitude: 11,
            availability: formData.availability,
            price: 4,
            amenities: [],
          },
        },
      });
      console.log("successfully added listing", newListing);
    } catch (error) {
      console.log(error);
    }
    console.log("added new listing");
  };

  return (
    <div className="new-listing-container">
      <Form.Root onSubmit={handleSubmit(handleNewListing)}>
        <Form.Field className="" name="listing_title">
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
        <Form.Field className="" name="listing_description">
          <Form.Label>listing description</Form.Label>
          <Form.Control asChild>
            <input
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
        <Form.Field className="" name="contact_method">
          <Form.Label>listing contact method</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("contact_method", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.contact_method?.message}</div>
        </Form.Field>
        <Form.Field className="" name="listing_image">
          <Form.Label>listing image</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("listing_image", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.listing_image?.message}</div>
        </Form.Field>
        <Form.Field className="" name="address">
          <Form.Label>listing address</Form.Label>
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
        <Form.Field className="" name="availability">
          <Form.Label>listing availability</Form.Label>
          <Form.Control asChild>
            <input type="checkbox" {...register("availability")} />
          </Form.Control>
          <div className="field-message">{errors.availability?.message}</div>
        </Form.Field>
        <Form.Field className="" name="price">
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
        <Form.Field className="" name="availability">
          <Form.Submit asChild>
            <button>add new listing</button>
          </Form.Submit>
        </Form.Field>
      </Form.Root>
    </div>
  );
}
