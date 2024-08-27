import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_USER_NOTIFICATIONS_QUERY } from "../../../utils/queries/notificationQueries";
import { useSelector } from "react-redux";

export default function NotificationsWatcher({ events }) {
  const userId = useSelector((state) => state.auth.currentUser);

  const { data, error, loading } = useQuery(GET_ALL_USER_NOTIFICATIONS_QUERY, {
    variables: { userId },
  });

  useEffect(() => {
    if (data && !loading) {
      console.log("notifications", data);
    } else {
      console.log(error);
    }
  }, [data, events]);
  return null;
}
