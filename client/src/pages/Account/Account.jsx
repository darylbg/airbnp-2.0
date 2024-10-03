import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import LoginRequiredPrompt from "../../components/LoginRequiredPrompt/LoginRequiredPrompt";
import "./Account.css";
import PlaceHolderPage from "../PlaceHolderPage/PlaceHolderPage";
import Footer from "../../components/Footer/Footer";

export default function Account() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.userDetails.byId);

  // splits url into breadcrumbs and links
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <div className="account-page">
      {isLoggedIn ? (
        <div className="account-page-content">
          <div className="account-page-breadcrumbs">
            <div className="account-header">
              <h1 className="page-header">Account</h1>
              <div className="account-subheader">
                <div className="subheader-details">
                  <strong>
                    {currentUser.first_name} {currentUser.last_name}
                  </strong>
                  {", "}
                  {currentUser.email}
                </div>
                <Link to="/my-profile" className="subheader-link">
                  Go to profile
                </Link>
              </div>
            </div>
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
      ) : (
        <>
          <PlaceHolderPage title="Log in to view your account." />
        </>
      )}
      <Footer />
    </div>
  );
}
