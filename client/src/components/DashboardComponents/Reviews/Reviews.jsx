import React, { useEffect, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import "./Reviews.css";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_ALL_USER_REVIEWS } from "../../../utils/queries/reviewsQueries";
import { setUserReviews } from "../../../reducers/reviewsReducer";

export default function Reviews() {
  const currentUser = useSelector((state) => state.userDetails.byId);
  const userReviewCount = useSelector(
    (state) => state.reviews.userReviews.count
  );
  const userReviewValue = useSelector(
    (state) => state.reviews.userReviews.value
  );
  const userReviews = useSelector((state) => state.reviews.userReviews.reviews);

  const dispatch = useDispatch();

  const {
    data: userReviewsData,
    error: userReviewsError,
    loading: userReviewsLoading,
  } = useQuery(GET_ALL_USER_REVIEWS, {
    variables: { userId: currentUser.id },
    skip: !currentUser.id,
  });
  console.log(userReviews);

  useEffect(() => {
    if (userReviewsData && !userReviewsLoading && !userReviewsError) {
      const reviews = userReviewsData.getAllUserReviews; // Get all reviews directly

      // Calculate the count and value from fetched data
      const count = reviews.length;
      const value =
        reviews.reduce((sum, review) => sum + review.rating_value, 0) / count ||
        0;

      const reviewData = {
        count: count,
        value: value,
        reviews: reviews,
      };

      dispatch(setUserReviews(reviewData));
    }
  }, [userReviewsData, userReviewsLoading, userReviewsError, dispatch]);

  function formatDateFromTimestamp(timestamp) {
    // Convert the timestamp to milliseconds
    const date = new Date(parseInt(timestamp, 10));

    // Get the day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    // Format the date as DD-MM-YYYY
    return `${day}-${month}-${year}`;
  }

  return (
    <>
      <DashboardHeader
        title="Reviews"
        subtitle="Manage your reviews"
        icon="reviews"
      >
        <div className="title-text">
          <h3>
            {parseInt(userReviewValue).toFixed(1)}
          </h3>
          <p>{`${userReviewCount} ${
            userReviewCount > 1 ? "reviews" : "review"
          }`}</p>
        </div>
      </DashboardHeader>
      <div className="dashboard-reviews-content">
        <div className="reviews-stats">
          <div className="review-stat">number of reviews</div>
          <div className="review-stat">rating *****</div>
          <div className="review-stat">distribution of reviews by rating</div>
        </div>
        <div className="reviews-list">
          {userReviews &&
            userReviews.map((review) => {
              return (
                <div className="review-item" key={review.id}>
                  <div className="review-user">
                    <img src={review.user.user_image} alt="" />
                    <div className="details">
                      <span className="date">
                        {formatDateFromTimestamp(review.createdAt)}
                      </span>
                      <span className="display-name">
                        {review.user.display_name}
                      </span>
                    </div>
                  </div>
                  <div className="review-content">
                    <div className="review-stars">
                      <span className="caption">rating:</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`${
                              i < review.rating_value
                                ? "star-filled"
                                : "star-empty"
                            } material-symbols-outlined`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="review-message">{review.rating_text}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
