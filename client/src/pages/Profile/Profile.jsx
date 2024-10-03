import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../utils/queries/userQueries";
import { useSelector } from "react-redux";
import { useHelperFunctions } from "../../HelperFunctions";
import { Rating } from "react-simple-star-rating";
import RatingComponent from "../../components/PrimitiveComponents/RatingComponent/RatingComponent";
import "./Profile.css";
import PlaceHolderPage from "../PlaceHolderPage/PlaceHolderPage";
import Footer from "../../components/Footer/Footer";

export default function Profile({ myProfile }) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { userId } = useParams();
  const [actualUserId, setActualUserId] = useState(null);

  useEffect(() => {
    if (myProfile) {
      setActualUserId(currentUser);
    } else {
      setActualUserId(userId);
    }
  }, [myProfile, userId]);

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { userId: actualUserId },
    skip: !actualUserId,
  });

  useEffect(() => {
    if (data) {
      // console.log("Profile of user:", data.getUserProfile);
    }
    if (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [data, error]);

  function timeAgo(timestamp) {
    const now = Date.now(); // Get the current timestamp in milliseconds
    const secondsAgo = Math.floor((now - Number(timestamp)) / 1000); // Calculate the difference in seconds

    const minutes = Math.floor(secondsAgo / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (secondsAgo < 60) {
      return [0, "now"]; // If less than 60 seconds ago
    } else if (minutes < 60) {
      return [minutes, minutes === 1 ? "minute hosting" : "minutes hosting"];
    } else if (hours < 24) {
      return [hours, hours === 1 ? "hour hosting" : "hours hosting"];
    } else if (days < 7) {
      return [days, days === 1 ? "day hosting" : "days hosting"];
    } else if (weeks < 4) {
      return [weeks, weeks === 1 ? "week hosting" : "weeks hosting"];
    } else if (months < 12) {
      return [months, months === 1 ? "month hosting" : "months hosting"];
    } else {
      return [years, years === 1 ? "year hosting" : "years hosting"];
    }
  }

  // Handle loading and error states
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error fetching profile: {error.message}</p>;

  // Destructure the user profile data from the GraphQL query result
  const userProfile = data?.getUserProfile;

  const [timeAgoValue, timeAgoUnit] = timeAgo(userProfile?.created_at);

  return (
    <div className="profile-page-wrapper">
      {myProfile && !isLoggedIn ? (
        <PlaceHolderPage title="Log in to view your profile." />
      ) : (
        <div className="profile-page">
          <div className="profile-heading-wrapper">
            <div className="profile-heading">
              <div className="user-overview">
                <div className="user-details">
                  <img
                    src={userProfile?.user_image}
                    className="profile-header-image"
                  />
                  <div className="profile-header-text">
                    <h3>{userProfile?.display_name}</h3>
                  </div>
                </div>

                <div className="user-stats">
                  <div className="stat">
                    <strong className="value">
                      {userProfile?.average_rating.count}
                    </strong>
                    <span className="caption">reviews</span>
                  </div>
                  <div className="stat">
                    <strong className="value">
                      <span className="star">&#9733; </span>
                      {userProfile?.average_rating.value.toFixed(1)}
                    </strong>
                    <span className="caption">rating</span>
                  </div>
                  <div className="stat">
                    <strong className="value">{timeAgoValue}</strong>
                    <span className="caption">{timeAgoUnit}</span>
                  </div>
                </div>
              </div>
              {myProfile && isLoggedIn && (
                <NavLink
                  to="/account/personal-info"
                  className="default-button primary-button edit-profile-button"
                >
                  <span class="material-symbols-outlined">edit</span>
                  <span>Update personal info</span>
                </NavLink>
              )}
            </div>
          </div>
          <div className="profile-body">
            {myProfile && isLoggedIn && (
              <div className="profile-page-caption">
                This is your public profile for others to see.
              </div>
            )}
            <div className="profile-listings">
              <h2 className="profile-section-title">
                {myProfile ? "My" : `${userProfile?.display_name}'s`} listings
              </h2>
              {userProfile?.user_listings.length < 1 ? (
                <span>No listings yet</span>
              ) : (
                <ul>
                  {userProfile?.user_listings &&
                    userProfile.user_listings.map((listing) => {
                      return (
                        <li key={listing.id} className="profile-listing">
                          <NavLink
                            to={
                              myProfile
                                ? "/dashboard/listings"
                                : `http://localhost:3000/search?dialog=${listing.id}`
                            }
                          >
                            <img
                              src={listing.listing_image[0]}
                              className="profile-listing-img"
                            />
                            <div className="profile-listing-text">
                              <div className="profile-listing-header">
                                <span className="home-type">
                                  private residence
                                </span>
                                <RatingComponent
                                  value={listing.average_rating.value}
                                />
                              </div>
                              <h2 className="title">{listing.listing_title}</h2>
                              <p className="description">
                                {listing.listing_description}
                              </p>
                            </div>
                          </NavLink>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <div className="profile-reviews">
              <h2 className="profile-section-title">
                {myProfile ? "My" : `${userProfile?.display_name}'s`} reviews
              </h2>
              <div className="booking-reviews">
                <div className="booking-reviews-header">
                  <div className="rating-overview">
                    <span className="rating-value">
                      {userProfile?.average_rating.value.toFixed(1)}
                    </span>
                    <div className="rating-stars">
                      <Rating
                        size={16}
                        allowFraction={true}
                        readonly={true}
                        count={5}
                        initialValue={userProfile?.average_rating.value}
                      />
                      <span className="text">
                        {userProfile?.average_rating.count} reviews
                      </span>
                    </div>
                  </div>
                </div>
                <div className="booking-reviews-list">
                  <ul className="listing-reviews">
                    {userProfile?.reviews &&
                      userProfile.reviews.map((review) => {
                        return (
                          <li key={review.id} className="listing-review">
                            <div className="listing-review-header">
                              <div className="review-details">
                                <img
                                  className="image"
                                  src={review.user.user_image}
                                  alt=""
                                />
                                <div className="text">
                                  {/* <h3>user</h3> */}
                                  <h3 className="display-name">
                                    {review.user.display_name}
                                  </h3>
                                  <span className="created-at">
                                    {timeAgo(review.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <Rating
                                size={16}
                                allowFraction={true}
                                readonly={true}
                                count={5}
                                initialValue={review.rating_value}
                              />
                            </div>
                            {review.message !== "" ? (
                              <div className="listing-review-body">
                                <p className="message">{review.rating_text}</p>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
