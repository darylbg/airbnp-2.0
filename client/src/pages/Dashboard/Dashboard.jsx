import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoginRequiredPrompt from "../../components/LoginRequiredPrompt";
import Bookings from "../../components/DashboardComponents/Bookings";
import Listings from "../../components/DashboardComponents/Listings/Listings";
import Notifications from "../../components/DashboardComponents/Notifications";
import Payments from "../../components/DashboardComponents/Payments";
import Reviews from "../../components/DashboardComponents/Reviews";
import "./Dashboard.css";
export default function Dashboard() {
  const currentUser = useSelector((state) => state.auth);
  const [activeDashboardTab, setActiveDashboardTab] = useState(0);
  const [mobileDashboardMenu, setMobileDashboardMenu] = useState(false);

  const handleActiveTab = (e) => {
    e.preventDefault();
  };

  const toggleMobileDashboardMenu = (e) => {
    e.preventDefault();
    setMobileDashboardMenu(!mobileDashboardMenu);
  };

  return (
    <>
      <div className="dashboard">
        {currentUser.isLoggedIn ? (
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
                  <button
                    onClick={() => {
                      setActiveDashboardTab(0);
                      setMobileDashboardMenu(false);
                    }}
                    className={`clickable
                    ${activeDashboardTab === 0 ? "active-dashboard-tab" : ""}`}
                  >
                    <span className="material-symbols-outlined">today</span>
                    <span className="text">Bookings</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button
                    onClick={() => {
                      setActiveDashboardTab(1);
                      setMobileDashboardMenu(false);
                    }}
                    className={`clickable
                    ${activeDashboardTab === 1 ? "active-dashboard-tab" : ""}`}
                  >
                    <span className="material-symbols-outlined">list</span>
                    <span className="text">Listings</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button
                    onClick={() => {
                      setActiveDashboardTab(2);
                      setMobileDashboardMenu(false);
                    }}
                    className={`clickable
                    ${activeDashboardTab === 2 ? "active-dashboard-tab" : ""}`}
                  >
                    <span className="material-symbols-outlined">
                      Notifications
                    </span>
                    <span className="text">Notifications</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button
                    onClick={() => {
                      setActiveDashboardTab(3);
                      setMobileDashboardMenu(false);
                    }}
                    className={`clickable
                    ${activeDashboardTab === 3 ? "active-dashboard-tab" : ""}`}
                  >
                    <span className="material-symbols-outlined">payments</span>
                    <span className="text">Payments</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button
                    onClick={() => {
                      setActiveDashboardTab(4);
                      setMobileDashboardMenu(false);
                    }}
                    className={`clickable
                      ${
                        activeDashboardTab === 4 ? "active-dashboard-tab" : ""
                      }`}
                  >
                    <span className="material-symbols-outlined">reviews</span>
                    <span className="text">Reviews</span>
                  </button>
                </div>
              </div>
              <div className="dashboard-menu-footer">
                <img src={currentUser.user.user_image} alt="user avatar" />
                <h3>
                  {currentUser.user.first_name +
                    " " +
                    currentUser.user.last_name}
                </h3>
                <p>{currentUser.user.email}</p>
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
              <img src={currentUser.user.user_image} alt="user avatar" className="menu-avatar" />
            </div>
            <div className="dashboard-content">
              {activeDashboardTab === 0 ? <Bookings /> : null}
              {activeDashboardTab === 1 ? <Listings /> : null}
              {activeDashboardTab === 2 ? <Notifications /> : null}
              {activeDashboardTab === 3 ? <Payments /> : null}
              {activeDashboardTab === 4 ? <Reviews /> : null}
            </div>
          </>
        ) : (
          <LoginRequiredPrompt />
        )}
      </div>
    </>
  );
}
