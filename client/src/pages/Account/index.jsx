import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import "./Profile.css";

export default function Account() {
  // splits url into breadcrumbs and links
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <div className="profile-page">
      <div className="profile-page-breadcrumbs">
        <h3>Profile</h3>
        <nav aria-label="breadcrumbs">
          <ol className="breadcrumbs">
            {pathSegments.map((segment, index) => (
              <li key={index} className="breadcrumb-item">
                <span>/</span>
                <Link to={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                  {segment}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="profile-page-content">
        {/* Render nested routes */}
        <Outlet />
      </div>
    </div>
  );
}
