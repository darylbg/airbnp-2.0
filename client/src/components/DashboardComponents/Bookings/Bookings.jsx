import React, { useEffect, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import "./Bookings.css";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID_QUERY } from "../../../utils/queries/userQueries";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setChatBotOpen } from "../../../reducers/chatBotReducer";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW_MUTATION } from "../../../utils/mutations/reviewMutations";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import { CREATE_NOTIFICATION_MUTATION } from "../../../utils/mutations/notificationMutations";

export default function Bookings() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  // console.log(currentUser);
  const [headingTitle, setHeadingTitle] = useState("Bookings overview");
  const [headingSubTitle, setHeadingSubTitle] = useState("View your bookings");
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);

  const dispatch = useDispatch();

  const [reviewData, setReviewData] = useState({
    reviewedListing: null,
    reviewedUserId: null,
    reviewedUserData: null,
    reviewType: "",
  });

  const reviewedUserId = reviewData.reviewedUserId || {};

  const { data, error, loading } = useQuery(GET_USER_BY_ID_QUERY, {
    variables: { reviewedUserId },
    skip: !reviewedUserId,
  });

  useEffect(() => {
    if (data) {
      console.log("reviewed user", data);
      // setReviewedUser(data.user);
      setReviewData((prevState) => ({
        ...prevState,
        reviewedUserId: data.user,
      }));
    } else {
      console.log(error);
    }
  }, [data, error]);

  const openReviewDialog = (listing, userId, bookingType) => {
    setReviewData({
      reviewedListing: listing,
      reviewedUserId: userId,
      reviewType: bookingType === "MyBookingHistory" ? "Listing" : "User",
    });
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

  const [createNotification] = useMutation(CREATE_NOTIFICATION_MUTATION);

  const [createReviewMutation] = useMutation(CREATE_REVIEW_MUTATION);
  const submitReview = async (formData) => {
    console.log(formData);
    try {
      const newReview = await createReviewMutation({
        variables: {
          reviewData: {
            listing_id: reviewData.reviewedListing.id,
            rating_text: formData.reviewComment,
            rating_value: +formData.rating,
            review_type: reviewData.reviewType,
            reviewed_user_id: reviewData.reviewedUserId,
            user: currentUser,
          },
        },
      });
      console.log("new review", newReview.data.createReview.id);
      const newReviewId = newReview.data.createReview.id;
      const newNotification = await createNotification({
        variables: {
          notificationInput: {
            notification_text: "left a review",
            notification_type: "Review",
            receiver: reviewData.reviewedUserId,
            reference_id: newReviewId,
            reference_type: "Review"

          },
        },
      });
      console.log(newNotification);
      setReviewDialog(false);
      reset();
      toast.success(
        <ToastComponent message="Review submitted"></ToastComponent>
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openChatBot = (item) => {
    const chatBotData = {
      open: true,
      sender: "sender",
      receiver: item,
    };
    dispatch(setChatBotOpen(chatBotData));
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
      <Outlet context={{ openReviewDialog, openChatBot }} />
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
          <p>{reviewData.reviewType} review</p>
          <div className="reviewed-listing">
            <div className="reviewed-listing-img">
              <img
                src={reviewData.reviewedListing?.listing_image[0] || ""}
                alt=""
              />
            </div>
            <div className="reviewed-listing-text">
              <p>rating: {reviewData.reviewedListing?.average_rating.value}</p>
              <p>Hosted by: {reviewData.reviewedUserData?.display_name}</p>
              <p>{reviewData.reviewedListing?.fullAddress}</p>
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
                <textarea id="comment" {...register("reviewComment")} />
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
