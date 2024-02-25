import React from "react";
import { useSelector } from "react-redux";
import LoginRequiredPrompt from "../../components/LoginRequiredPrompt";
import "./Dashboard.css";

export default function Dashboard() {
  const currentUser = useSelector((state) => state.auth);
  console.log("user", currentUser);
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
                  <button>
                    <span className="material-symbols-outlined">today</span>
                    <span className="hide-on-sm">Bookings</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button>
                    <span className="material-symbols-outlined">list</span>
                    <span className="hide-on-sm">Listings</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button>
                    <span className="material-symbols-outlined">Notifications</span>
                    <span className="hide-on-sm">Notifications</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button>
                    <span className="material-symbols-outlined">payments</span>
                    <span className="hide-on-sm">Payments</span>
                  </button>
                </div>
                <div className="dashboard-menu-item">
                  <button>
                    <span className="material-symbols-outlined">reviews</span>
                    <span className="hide-on-sm">Reviews</span>
                  </button>
                </div>
              </div>
              <div className="dashboard-menu-footer">
                <img src={currentUser.user.user_image} alt="user avatar" />
                <h3>{currentUser.user.first_name + " " + currentUser.user.last_name}</h3>
                <p>{currentUser.user.email}</p>
              </div>
            </div>
            <div className="dashboard-content">dontent</div>
          </>
        ) : (
          <LoginRequiredPrompt />
        )}
      </div>
    </>
  );
}
