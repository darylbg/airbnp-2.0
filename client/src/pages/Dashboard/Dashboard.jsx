import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import LoginRequiredPrompt from "../../components/LoginRequiredPrompt/LoginRequiredPrompt";
import "./Dashboard.css";
export default function Dashboard() {
  // querying redux for logged in user
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.userDetails.byId);
  const newNotifications = useSelector((state) => state.notifications.userNotifications.unread)

  const [mobileDashboardMenu, setMobileDashboardMenu] = useState(false);

  const toggleMobileDashboardMenu = (e) => {
    e.preventDefault();
    setMobileDashboardMenu(!mobileDashboardMenu);
  };
  return (
    <>
      <div className="dashboard">
        {isLoggedIn ? (
          <>
            <div
              className={`dashboard-menu ${
                mobileDashboardMenu
                  ? "mobile-dashboard-menu-open"
                  : "mobile-dashboard-menu-closed"
              }`}
            >
              <div className="dashboard-menu-title hide-on-sm">
                <h2>Dashboard</h2>
              </div>
              <div className="dashboard-menu-items">
                <div className="dashboard-menu-item">
                  <NavLink
                    onClick={() => setMobileDashboardMenu(false)}
                    to="bookings"
                    className={({ isActive }) =>
                      `clickable ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="material-symbols-outlined">today</span>
                    <span className="text">Bookings</span>
                  </NavLink>
                </div>
                <div className="dashboard-menu-item">
                  <NavLink
                    onClick={() => setMobileDashboardMenu(false)}
                    to="listings"
                    className={({ isActive }) =>
                      `clickable ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="material-symbols-outlined">list</span>
                    <span className="text">Listings</span>
                  </NavLink>
                </div>
                <div className="dashboard-menu-item">
                  <NavLink
                    onClick={() => setMobileDashboardMenu(false)}
                    to="notifications"
                    className={({ isActive }) =>
                      `clickable ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="material-symbols-outlined">
                      notifications
                    </span>
                    <span className="text">Notifications</span>
                    <span class="dashboard-notification-alert">{newNotifications.length > 0 ? newNotifications.length : null}</span>
                  </NavLink>
                </div>
                <div className="dashboard-menu-item">
                  <NavLink
                    onClick={() => setMobileDashboardMenu(false)}
                    to="payments"
                    className={({ isActive }) =>
                      `clickable ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="material-symbols-outlined">payments</span>
                    <span className="text">Payments</span>
                  </NavLink>
                </div>
                <div className="dashboard-menu-item">
                  <NavLink
                    onClick={() => setMobileDashboardMenu(false)}
                    to="reviews"
                    className={({ isActive }) =>
                      `clickable ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="material-symbols-outlined">reviews</span>
                    <span className="text">Reviews</span>
                  </NavLink>
                </div>
              </div>
              <div className="dashboard-menu-footer">
                <img src={currentUser.user_image} alt="user avatar" />
                <h3>
                  {currentUser.first_name +
                    " " +
                    currentUser.last_name}
                </h3>
                <p>{currentUser.email}</p>
              </div>
            </div>
            <div className="mobile-dashboard-menu hide-on-md">
              <button onClick={toggleMobileDashboardMenu} className="clickable">
                <span className="material-symbols-outlined">
                  {mobileDashboardMenu ? "close" : "menu"}
                </span>
              </button>
              <div className="menu-header">
                <h3>Dashboard</h3>
              </div>
              {/* <img
                src={currentUser.user_image}
                alt="user avatar"
                className="menu-avatar"
              /> */}
            </div>
            <div className="dashboard-content scrollbar-1">
              <Outlet />
            </div>
          </>
        ) : (
          <LoginRequiredPrompt />
        )}
      </div>
    </>
  );
}
