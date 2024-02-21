import React from "react";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-menu">
        <div className="dashboard-menu-title">
          <h2>Dashboard</h2>
        </div>
        <div className="dashboard-menu-items">
          <div className="dashboard-menu-item">
            <button>
              <span class="material-symbols-outlined">today</span>
              <span>Bookings</span>
            </button>
          </div>
          <div className="dashboard-menu-item">
            <button>
            <span class="material-symbols-outlined">list</span>
              <span>Listings</span>
            </button>
          </div>
          <div className="dashboard-menu-item">
            <button>
            <span class="material-symbols-outlined">Notifications</span>
              <span>Notifications</span>
            </button>
          </div>
          <div className="dashboard-menu-item">
            <button>
            <span class="material-symbols-outlined">payments</span>
              <span>Payments</span>
            </button>
          </div>
          <div className="dashboard-menu-item">
            <button>
            <span class="material-symbols-outlined">reviews</span>
              <span>Reviews</span>
            </button>
          </div>
        </div>
        <div className="dashboard-menu-footer">Daryl Blough</div>
      </div>
      <div className="dashboard-content">dontent</div>
    </div>
  );
}
