import React, { useEffect, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import "./Bookings.css";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID_QUERY } from "../../../utils/queries/userQueries";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW_MUTATION } from "../../../utils/mutations/reviewMutations";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import { Preview } from "@mui/icons-material";

export default function Bookings() {
  const [headingTitle, setHeadingTitle] = useState("Bookings overview");
  const [headingSubTitle, setHeadingSubTitle] = useState("View your bookings");
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewedListing, setReviewedListing] = useState(null);
  const [reviewedUser, setReviewedUser] = useState(null);

  const [reviewData, setReviewData] = useState({
    listing: null,
    userId: null,
    userData: null,
    bookingType: ""
  });
  console.log(reviewData);

  const userId = reviewData.userId || {};

  const { data, error, loading } = useQuery(GET_USER_BY_ID_QUERY, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      console.log("reviewed user", data)
      setReviewedUser(data.user);
      setReviewData(prevState => ({
        ...prevState, 
        userData: data.user
      }))
    } else {
      console.log(error);
    }
  }, [data, error]);

  const openReviewDialog = (listing, user, bookingType) => {
    setReviewedListing(listing);
    setReviewedUser(user)

    setReviewData({
      listing: listing,
      userId: user,
      bookingType: bookingType
    })
    setReviewDialog(true);
  };

  const closeReviewDialog = () => {
    setReviewDialog(false);
    reset();
  };

  const dropdownMenuToggle = () => {
    setDropdownMenu(!dropdownMenu);
  };

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/")[3];
    if (path === "guest-reservations") {
      setHeadingTitle("Guest Reservations");
      setHeadingSubTitle("Manage reservations to your listings");
    } else if (path === "my-booking-history") {
      setHeadingTitle("My Booking History");
      setHeadingSubTitle("View your bookings");
    } else {
      setHeadingTitle("Bookings Overview");
      setHeadingSubTitle("Manage guest reservations and your bookings");
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

const [createReviewMutation] = useMutation(CREATE_REVIEW_MUTATION);
  const submitReview = async (formData) => {
    console.log(formData);
    try {
      const newReview = await createReviewMutation({
        variables: {
          reviewType: "Listing",
          reviewedUserId: reviewedListing.user_id,
          listingId: reviewedListing.id,
          reviewData: {
            rating_value: +formData.rating,
            rating_text: formData.reviewComment
          }
        }
      })
      console.log("new review", newReview);
      setReviewDialog(false);
      reset();
      toast.success(<ToastComponent message="Review submitted"></ToastComponent>)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DashboardHeader
        title={headingTitle}
        subtitle={headingSubTitle}
        icon="today"
      >
        <div
          className="dropdown-menu"
          style={{
            borderBottomLeftRadius: !dropdownMenu ? "4px" : "0",
            borderBottomRightRadius: !dropdownMenu ? "4px" : "0",
          }}
        >
          <div className="dropdown-menu-trigger">
            <ButtonComponent
              type="button"
              className="default-button"
              action={dropdownMenuToggle}
            >
              <span>{headingTitle}</span>
              <span className={`material-symbols-outlined`}>
                {dropdownMenu ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            </ButtonComponent>
          </div>
          {dropdownMenu && (
            <div className="dropdown-menu-content">
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings"
                onClick={dropdownMenuToggle}
                type="button"
              >
                <span>Bookings overview</span>
              </NavLink>
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings/guest-reservations"
                onClick={dropdownMenuToggle}
                type="button"
              >
                <span>Guest reservations</span>
              </NavLink>
              <NavLink
                end
                className="default-button dropdown-menu-item"
                to="/dashboard/bookings/my-booking-history"
                onClick={dropdownMenuToggle}
                type="button"
              >
                <span>My booking history</span>
              </NavLink>
            </div>
          )}
        </div>
      </DashboardHeader>
      <Outlet context={{ openReviewDialog }} />
      <DialogComponent
        className="content-width-dialog review-dialog"
        dialogState={reviewDialog}
        closeDialog={closeReviewDialog}
        dialogHeader="Leave a review"
        icon="close"
        backdropClosable={false}
        minimize={false}
      >
        <div className="review-dialog-content">
          <div className="reviewed-listing">
            <div className="reviewed-listing-img">
              <img src={reviewedListing?.listing_image[0] || ""} alt="" />
            </div>
            <div className="reviewed-listing-text">
              <p>rating: {reviewData.listing?.average_rating.value}</p>
              <p>Hosted by: {reviewData.userData?.display_name}</p>
              <p>{reviewData.listing?.fullAddress}</p>
            </div>
          </div>
          <div className="review-input">
            <form onSubmit={handleSubmit(submitReview)}>
              <span>Rate</span>
              <div className="rating">
                <input
                  {...register("rating", { required: true })}
                  type="radio"
                  id="star5"
                  name="rating"
                  value="5"
                />
                <label for="star5">&#9733;</label>
                <input
                  {...register("rating", { required: true })}
                  type="radio"
                  id="star4"
                  name="rating"
                  value="4"
                />
                <label for="star4">&#9733;</label>
                <input
                  {...register("rating", { required: true })}
                  type="radio"
                  id="star3"
                  name="rating"
                  value="3"
                />
                <label for="star3">&#9733;</label>
                <input
                  {...register("rating", { required: true })}
                  type="radio"
                  id="star2"
                  name="rating"
                  value="2"
                />
                <label for="star2">&#9733;</label>
                <input
                  {...register("rating", { required: true })}
                  type="radio"
                  id="star1"
                  name="rating"
                  value="1"
                />
                <label for="star1">&#9733;</label>
              </div>

              {errors.rating && <p className="error">Rating is required.</p>}

              <div className="comment">
                <label htmlFor="comment">Leave a comment</label>
                <textarea
                  id="comment"
                  {...register("reviewComment", { required: true })}
                />
                {errors.reviewComment && (
                  <p className="error">Comment is required.</p>
                )}
              </div>

              <ButtonComponent
                type="submit"
                className="default-button primary-button"
              >
                Submit
              </ButtonComponent>
            </form>
          </div>
        </div>
      </DialogComponent>
    </>
  );
}
