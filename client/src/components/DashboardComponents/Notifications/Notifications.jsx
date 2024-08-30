import React, { useEffect, useState, useRef } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import { useSelector, useDispatch } from "react-redux";
import WindowControlButton from "../../PrimitiveComponents/WindowControlButton/WindowControlButton";
import ButtonComponent from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./Notifications.css";
import { useMutation } from "@apollo/client";
import { UPDATE_NOTIFICATION_STATUS_MUTATION, DELETE_NOTIFICATION_MUTATION } from "../../../utils/mutations/notificationMutations";

export default function Notifications() {
  const allNotifications = useSelector(
    (state) => state.notifications.userNotifications
  );

  const [filter, setFilter] = useState("Inbox");
  const [notificationData, setNotificationData] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);

  useEffect(() => {
    console.log("all notifications", allNotifications);
    let filteredNotifications = [];
  
    switch (filter) {
      case "Inbox":
        filteredNotifications = [...allNotifications.inbox]; // Make a shallow copy
        break;
      case "Archived":
        filteredNotifications = [...allNotifications.archived]; // Make a shallow copy
        break;
      case "All":
        filteredNotifications = [...allNotifications.all]; // Make a shallow copy
        break;
      default:
        return;
    }
  
    // Sort the copied notifications by 'createdAt' in descending order
    filteredNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    setNotificationData(filteredNotifications);
  }, [filter, allNotifications]);
  
  

  function formatDate(timestamp) {
    // Create a new Date object using the timestamp
    const date = new Date(timestamp);

    // Extract date components
    const day = String(date.getDate()).padStart(2, "0"); // Get day of the month, pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-based index, so +1), pad with leading zero
    const year = date.getFullYear(); // Get full year

    // Extract time components
    const hours = String(date.getHours()).padStart(2, "0"); // Get hours, pad with leading zero if needed
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes, pad with leading zero if needed

    // Format date as "DD-MM-YYYY HH:mm"
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const toggleNotificationDetail = (e, id) => {
    // e.stopPropagation();
    if (expandedNotification === id) {
      setExpandedNotification(null);
      
    } else {
      // markAsReadNotification(e, id);
      setExpandedNotification(id);
    }
  };

  const [updateNotificationStatusMutation] = useMutation(UPDATE_NOTIFICATION_STATUS_MUTATION);

  const markAsReadNotification = async (e, id) => {
    e.stopPropagation();
    // console.log("archived notification:", id);
    try {
      const updatedNotification = await updateNotificationStatusMutation({
        variables: {notificationId: id, notificationStatus: "Read"}
      });
      // console.log(updatedNotification);
    } catch (error) {
      console.log(error)
    }
  }
  
  const archiveNotification = async (e, id) => {
    e.stopPropagation();
    // console.log("archived notification:", id);
    try {
      const updatedNotification = await updateNotificationStatusMutation({
        variables: {notificationId: id, notificationStatus: "Archived"}
      });
      // console.log("updated notification", updatedNotification);
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    // console.log("archived notification:", id);
    try {
      const deletedNotification = await updateNotificationStatusMutation({
        variables: {notificationId: id, notificationStatus: "Deleted"}
      });
      console.log("deleted notification", deletedNotification);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <DashboardHeader
        className="notifications-dashboard-header"
        title="Notifications"
        subtitle="Manage your notifications"
        icon="notifications"
      ></DashboardHeader>
      <div className="notifications-content">
        <div className="filter-button-group">
          <ButtonComponent
            action={() => setFilter("Inbox")}
            type="button"
            className={`default-button table-filter-button ${
              filter === "Inbox" ? "selected" : ""
            }`}
          >
            <span>Inbox</span>
            <span className={`notification-alert ${allNotifications.unread.length > 1 ? "notification-alert-inbox" : ""}`}>
              {allNotifications.unread.length > 1 ? allNotifications.unread.length : allNotifications.inbox.length}
            </span>
          </ButtonComponent>
          <ButtonComponent
            action={() => setFilter("Archived")}
            type="button"
            className={`default-button table-filter-button ${
              filter === "Archived" ? "selected" : ""
            }`}
          >
            <span>Archived</span>
            <span className="notification-alert">
              {allNotifications.archived.length}
            </span>
          </ButtonComponent>
          <ButtonComponent
            action={() => setFilter("All")}
            type="button"
            className={`default-button table-filter-button ${
              filter === "All" ? "selected" : ""
            }`}
          >
            <span>All</span>
            <span className="notification-alert">
              {allNotifications.all.length}
            </span>
          </ButtonComponent>
        </div>
        <div className="notifications-display">
          <ul className="notifications-list">
            {notificationData &&
              notificationData.map((notification) => {
                return (
                  <li
                    key={notification.id}
                    className={`notification-item notification-${notification.notification_status.toLowerCase()}`}
                  >
                    <div
                      onClick={(e) => toggleNotificationDetail(e, notification.id)}
                      className="notification-detail"
                    >
                      <div className="notification-detail-header">
                        <div className="notification-header-image">
                          <img
                            src={notification.sender.user_image}
                            alt="profile image"
                          />
                        </div>
                        <div className="notification-header-content">
                          <div className="title">
                            <strong>{notification.sender.display_name}</strong>
                            <span>{notification.notification_text}</span>
                          </div>
                          <div className="timestamp">
                            {formatDate(+notification.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="notification-detail-footer">
                        <div className="notification-status"></div>
                        <WindowControlButton
                          icon={
                            notification.notification_status === "Archived"
                              ? "delete"
                              : "archive"
                          }
                          action={(e) => {
                            notification.notification_status === "Archived"
                            ? deleteNotification(e, notification.id)
                            : archiveNotification(e, notification.id)
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display:
                          expandedNotification === notification.id
                            ? "flex"
                            : "none",
                      }}
                      className="notification-expand"
                    >
                      hello world
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
