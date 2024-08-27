import React, { useEffect } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import { useQuery } from "@apollo/client";
import { GET_ALL_USER_NOTIFICATIONS_QUERY } from "../../../utils/queries/notificationQueries";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications } from "../../../reducers/notificationsReducer";

export default function Notifications() {
  const userId = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const {
    data,
    error,
    loading,
  } = useQuery(GET_ALL_USER_NOTIFICATIONS_QUERY, {
    variables: {userId: userId},
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      console.log("user notifications", data);
    } else {
      console.log(error)
    }
  }, [data]);

  return (
    <>
      <DashboardHeader
        title="Notifications"
        subtitle="Manage your notifications"
        icon="notifications"
      ></DashboardHeader>
    </>
  );
}
