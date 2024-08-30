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
      console.log("running notification watcher", data);
  
      // Filter out notifications with the "Deleted" status
      const allNotifications = data.getAllUserNotifications.filter(
        (notification) => notification.notification_status !== "Deleted"
      );
  
      // Sort all notifications by 'createdAt' in descending order
      allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      // Filter notifications based on their status
      const unreadNotifications = filterNotificationsByStatus(allNotifications, "Unread");
      const readNotifications = filterNotificationsByStatus(allNotifications, "Read");
      const archivedNotifications = filterNotificationsByStatus(allNotifications, "Archived");
  
      // Combine 'unread' and 'read' notifications to create the 'inbox'
      const inboxNotifications = [...unreadNotifications, ...readNotifications];
  
      // Ensure 'inboxNotifications' is sorted in descending order by 'createdAt'
      inboxNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      // Prepare the notification data object to update the state
      const notificationData = {
        all: allNotifications,
        unread: unreadNotifications,
        read: readNotifications,
        archived: archivedNotifications,
        inbox: inboxNotifications, 
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
