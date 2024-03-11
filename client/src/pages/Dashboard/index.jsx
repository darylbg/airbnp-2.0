import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoginRequiredPrompt from "../../components/LoginRequiredPrompt";
import Bookings from "../../components/DashboardComponents/Bookings";
import Listings from "../../components/DashboardComponents/Listings";
import Notifications from "../../components/DashboardComponents/Notifications";
import Payments from "../../components/DashboardComponents/Payments";
import Reviews from "../../components/DashboardComponents/Reviews";
import "./Dashboard.css";
export default function Dashboard() {
  const currentUser = useSelector((state) => state.auth);
  const [activeDashboardTab, setActiveDashboardTab] = useState(0);

  return (
    <>
      <div className="dashboard">
        {currentUser.isLoggedIn ? (
          <>
            <div className="dashboard-menu">
              <div className="dashboard-menu-title hide-on-sm">
                <h2>Dashboard</h2>
              </div>
              <div className="dashboard-menu-items">
                <div className="dashboard-menu-item">
                  <button onClick={() => setActiveDashboardTab(0)}
                  className={activeDashboardTab === 0 ? "active-dashboard-tab" : ""}
                  >
                    <span className="material-symbols-outlined">today</span>
                    <span className="hide-on-sm text">Bookings</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                <button onClick={() => setActiveDashboardTab(1)}
                  className={activeDashboardTab === 1 ? "active-dashboard-tab" : ""}
                  >
                    <span className="material-symbols-outlined">list</span>
                    <span className="hide-on-sm text">Listings</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                <button onClick={() => setActiveDashboardTab(2)}
                  className={activeDashboardTab === 2 ? "active-dashboard-tab" : ""}
                  >
                    <span className="material-symbols-outlined">
                      Notifications
                    </span>
                    <span className="hide-on-sm text">Notifications</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                <button onClick={() => setActiveDashboardTab(3)}
                  className={activeDashboardTab === 3 ? "active-dashboard-tab" : ""}
                  >
                    <span className="material-symbols-outlined">payments</span>
                    <span className="hide-on-sm text">Payments</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                <button onClick={() => setActiveDashboardTab(4)}
                  className={activeDashboardTab === 4 ? "active-dashboard-tab" : ""}
                  >
                    <span className="material-symbols-outlined">reviews</span>
                    <span className="hide-on-sm text">Reviews</span>
                  </button>
                </div>
              </div>
              <div className="dashboard-menu-footer hide-on-sm">
                <img src={currentUser.user.user_image} alt="user avatar" />
                <h3>
                  {currentUser.user.first_name +
                    " " +
                    currentUser.user.last_name}
                </h3>
                <p>{currentUser.user.email}</p>
              </div>
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
