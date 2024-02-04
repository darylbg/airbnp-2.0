import React from "react";
import { Link } from "react-router-dom";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import SignIn from "../SignInDialog";
import "./Navbar.css";

export default function Navbar() {
  return (
    <>
      <NavigationMenu.Root className="navigation-menu-root">
        {/* logo */}
        <div className="navigation-menu-logo">
          <Link to="/">airbnp</Link>
        </div>
        {/* centered search button */}
        <div className="navigation-menu-search">
          <Link to="/search" className="">
            Search
            <MagnifyingGlassIcon />
          </Link>
        </div>
        {/* right aligned menu */}
        <NavigationMenu.List className="navigation-menu-list">
          <NavigationMenu.Item className="navigation-menu-item">
            <NavigationMenu.Link asChild>
              <Link to="/" className="navigation-menu-link">
                Home
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="navigation-menu-item">
            <NavigationMenu.Link asChild>
              <Link to="/about" className="navigation-menu-link">
                About us
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="navigation-menu-item">
            <NavigationMenu.Link asChild>
              <Link to="/contact" className="navigation-menu-link">
                Contact us
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="navigation-menu-item">
            <Dialog.Root>
              <Dialog.Trigger className="sign-in-button ">
                Sign in
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="signIn-dialog-overlay" />
                <Dialog.Content className="signIn-dialog-content">
                  <SignIn />
                  <Dialog.Close asChild>
                    <span class="material-symbols-outlined signIn-dialog-close">
                      close
                    </span>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="navigation-menu-item navigation-menu-dropdown">
            <NavigationMenu.Trigger className="navigation-menu-trigger">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                alt="Profile"
              />
              <HamburgerMenuIcon className="hamburger-menu-icon" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="navigation-menu-content">
              <NavigationMenu.Item className="navigation-menu-item" asChild>
                <NavigationMenu.Link asChild>
                  <Link
                    to="/account"
                    className="navigation-menu-link dropdown-menu-link"
                  >
                    Account
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="navigation-menu-item" asChild>
                <NavigationMenu.Link asChild>
                  <Link
                    to="/dashboard"
                    className="navigation-menu-link dropdown-menu-link"
                  >
                    Dashboard
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="navigation-menu-item" asChild>
                <NavigationMenu.Link asChild>
                  <Link className="navigation-menu-link dropdown-menu-link">
                    Logout
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </>
  );
}
