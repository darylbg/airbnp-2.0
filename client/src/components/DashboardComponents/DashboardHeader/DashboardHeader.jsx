import React from "react";
import "./DashboardHeader.css";

export default function DashboardHeader({ title, icon, subtitle, children }) {
  return (
    <div className="dashboard-header">
      <div className="header-title">
        <div className="title-icon">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="title-text">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="header-content">{children}</div>
    </div>
  );
}
