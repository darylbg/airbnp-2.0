import React from 'react';
import "./DashboardHeader.css";

export default function DashboardHeader({...props}) {
  return (
    <div className='dashboard-header'>
      <div className="header-title">
        <div className="title-icon">
        <span className="material-symbols-outlined">list</span>
        </div>
        <div className="title-text">
            <h3>Listings</h3>
            <p>Add, revise or delete your listings</p>
        </div>
      </div>
      <div className="header-content">content</div>
    </div>
  )
}
