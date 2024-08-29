import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_USER_NOTIFICATIONS_QUERY } from "../../../utils/queries/notificationQueries";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications } from "../../../reducers/notificationsReducer";

export default function NotificationsWatcher({ events }) {
  const userId = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  const { data, error, loading } = useQuery(GET_ALL_USER_NOTIFICATIONS_QUERY, {
    variables: { userId },
  });

  useEffect(() => {
    if (data && !loading) {
      console.log("running notification watcher", data)
      const allNotifications = data.getAllUserNotifications;
      const unreadNotifications = filterNotificationsByStatus(allNotifications, "Unread");
      const readNotifications = filterNotificationsByStatus(allNotifications, "Read");
      const archivedNotifications = filterNotificationsByStatus(allNotifications, "Archived");
      
      const notificationData = {
        all: allNotifications,
        unread: unreadNotifications,
        read: readNotifications,
        archived: archivedNotifications,
      };

      dispatch(setNotifications(notificationData));
    } else {
      console.log(error);
    }
  }, [data, events]);

  const filterNotificationsByStatus = (notifications, status) => {
    return notifications.filter((notification) => {
      switch (status) {
        case "Unread":
          return notification.notification_status === "Unread";
        case "Read":
          return notification.notification_status === "Read";
        case "Archived":
          return notification.notification_status === "Archived";
        default:
          return false;
      }
    });
  };

  return null;
}
