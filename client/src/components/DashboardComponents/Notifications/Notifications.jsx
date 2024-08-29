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

  const notificationRef = useRef();

  const [filter, setFilter] = useState("Inbox");
  const [notificationData, setNotificationData] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);
  // console.log("inbox", notificationData);

  useEffect(() => {
    switch (filter) {
      case "Inbox":
        return setNotificationData([
          ...allNotifications.unread,
          ...allNotifications.read,
        ]);
      case "Archived":
        return setNotificationData(allNotifications.archived);
      case "All":
        return setNotificationData(allNotifications.all);
      default:
        return false;
    }
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
      markAsReadNotification(e, id);
      setExpandedNotification(id);
    }
  };

  const [updateNotificationStatusMutation] = useMutation(UPDATE_NOTIFICATION_STATUS_MUTATION);
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION_MUTATION);

  const markAsReadNotification = async (e, id) => {
    e.stopPropagation();
    console.log("archived notification:", id);
    try {
      const updatedNotification = await updateNotificationStatusMutation({
        variables: {notificationId: id, notificationStatus: "Read"}
      });
      console.log(updatedNotification);
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {

  // }, [no])
  
  const archiveNotification = async (e, id) => {
    e.stopPropagation();
    console.log("archived notification:", id);
    try {
      const updatedNotification = await updateNotificationStatusMutation({
        variables: {notificationId: id, notificationStatus: "Archived"}
      });
      console.log(updatedNotification);
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNotification = async (e, receiverId, notificationId) => {
    e.stopPropagation();
    console.log("deleted notification:", notificationId);
    try {
      const updatedUser = await deleteNotificationMutation({
        variables: {receiverId: receiverId, notificationId: notificationId}
      });
      console.log(updatedUser);
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
            <span className="notification-alert">
              {allNotifications.unread.length}
            </span>
          </ButtonComponent>
          <ButtonComponent
            action={() => setFilter("Archived")}
            type="button"
            className={`default-button table-filter-button ${
              filter === "Archived" ? "selected" : ""
            }`}
          >
            Archived
          </ButtonComponent>
          <ButtonComponent
            action={() => setFilter("All")}
            type="button"
            className={`default-button table-filter-button ${
              filter === "All" ? "selected" : ""
            }`}
          >
            All
          </ButtonComponent>
        </div>
        <div className="notifications-display">
          <ul className="notifications-list">
            {notificationData &&
              notificationData.map((notification) => {
                return (
                  <li
                    key={notification.id}
                    ref={notificationRef}
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
                            ? deleteNotification(e, notification.receiver.id, notification.id)
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
