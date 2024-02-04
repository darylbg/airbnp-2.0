import React from "react";
import { Link } from "react-router-dom";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { HomeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import "./MobileNavbar.css";

export default function index() {
  return (
    <NavigationMenu.Root className="mobile-navbar-root">
      <NavigationMenu.List className="mobile-navbar-list">
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/">
              <span className="material-symbols-outlined mobile-navbar-icon">Home</span>
              <span className="mobile-navbar-text">Home</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/search">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">Search</span>
              <span className="mobile-navbar-text">Search</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/about">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">description</span>
              <span className="mobile-navbar-text">About</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/contact">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">Call</span>
              <span className="mobile-navbar-text">Contact</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/account">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">account_circle</span>
              <span className="mobile-navbar-text">Account</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
