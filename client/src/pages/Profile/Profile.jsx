import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../utils/queries/userQueries";
import { useSelector } from "react-redux";
import { useHelperFunctions } from "../../HelperFunctions";
import "./Profile.css";

export default function Profile({ myProfile }) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { userId } = useParams();
  const [actualUserId, setActualUserId] = useState(null);

  const { formatDateFromTimestamp } = useHelperFunctions();

  useEffect(() => {
    if (myProfile) {
      setActualUserId(currentUser);
    } else {
      setActualUserId(userId);
    }
  }, [myProfile, currentUser, userId]);

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

  // Handle loading and error states
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error fetching profile: {error.message}</p>;

  // Destructure the user profile data from the GraphQL query result
  const userProfile = data?.getUserProfile;
  console.log(userProfile);

  return (
    <>
      {myProfile && !currentUser ? (
        <p>please log in</p>
      ) : (
        <div className="profile-page">
          <div className="profile-heading-wrapper">
            <div className="profile-heading">
              <div className="user-overview">
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
                  <strong className="value">100</strong>
                  <span className="caption">reviews</span>
                </div>
                <div className="stat">
                  <strong className="value">100</strong>
                  <span className="caption">reviews</span>
                </div>
                <div className="stat">
                  <strong className="value">100</strong>
                  <span className="caption">reviews</span>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-body">
            <div>sadf</div>
          </div>
        </div>
      )}
    </>
  );
}
