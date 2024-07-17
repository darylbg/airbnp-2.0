import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import authService from "../../utils/auth";
import SignInForm from "../SignInForm/SignInForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import DialogComponent from "../PrimitiveComponents/DialogComponent/DialogComponent";
import Logo from "../../assets/images/logo_colour_50px.png";
import "./Navbar.css";
import toast from "react-hot-toast";

export default function Navbar({}) {
  const [toggleSignInRegister, setToggleSignInRegister] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // querying redux for logged in user
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.userDetails.byId);

  // set sign in form to default display when dialog is opened
  useEffect(() => {
    if (!dialogOpen) {
      setToggleSignInRegister(true);
    }
  }, [dialogOpen]);

  // set shadow on navbar when page scrolled
  useEffect(() => {
    const handlePageScroll = (event) => {
      window.scrollY > 0 ? setScrolled(true) : setScrolled(false);
    };
    window.addEventListener("scroll", handlePageScroll);
    return () => {
      window.removeEventListener("scroll", handlePageScroll);
    };
  }, []);

  // toggle between sign in and register forms
  const handleSignInRegisterToggle = (e) => {
    e.preventDefault();
    setToggleSignInRegister(!toggleSignInRegister);
  };

  const logout = (e) => {
    e.preventDefault();
    authService.logout().then(() => {
      window.location.assign("/"); // This reloads the page and redirects to the root URL
    });
  };

  return (
    <>
      <NavigationMenu.Root
        className={`navigation-menu-root ${scrolled ? "window-scrolled" : ""}`}
      >
        {/* logo */}
        <div className="navigation-menu-logo">
          <Link to="/">
            <img src={Logo}></img>AIRBNP
          </Link>
        </div>
        {/* centered search button */}
        <div className="navigation-menu-search">
          <Link to="/search" className="">
            Search
            {/* <MagnifyingGlassIcon /> */}
            <span className="material-symbols-outlined">
              <span className="material-symbols-outlined">
                location_searching
              </span>
            </span>
          </Link>
        </div>
        {/* right aligned menu */}
        <NavigationMenu.List className="navigation-menu-list">
          <NavigationMenu.Item className="navigation-menu-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navigation-menu-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="navigation-menu-item">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `navigation-menu-link ${isActive ? "active" : ""}`
              }
            >
              About us
            </NavLink>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="navigation-menu-item">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `navigation-menu-link ${isActive ? "active" : ""}`
              }
            >
              Contact us
            </NavLink>
          </NavigationMenu.Item>
          {isLoggedIn ? (
            <NavigationMenu.Item className="navigation-menu-item navigation-menu-dropdown">
              <NavigationMenu.Trigger className="navigation-menu-trigger">
                <img src={currentUser.user_image} alt="Account" />
                {/* <span className="material-symbols-outlined">menu</span> */}
                <HamburgerMenuIcon
                  className="hamburger-menu-icon"
                  aria-hidden
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="navigation-menu-content">
                <NavigationMenu.Item className="navigation-menu-item" asChild>
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      `navigation-menu-link dropdown-menu-link ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    Account
                  </NavLink>
                </NavigationMenu.Item>
                <NavigationMenu.Item className="navigation-menu-item" asChild>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `navigation-menu-link dropdown-menu-link ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                </NavigationMenu.Item>
                <NavigationMenu.Item className="navigation-menu-item" asChild>
                  <NavLink
                    to="/dashboard/bookings"
                    className={({ isActive }) =>
                      `navigation-menu-link dropdown-menu-link ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </NavigationMenu.Item>
                <NavigationMenu.Item className="navigation-menu-item" asChild>
                    <Link
                      className="navigation-menu-link dropdown-menu-link"
                      onClick={logout}
                    >
                      Logout
                    </Link>
                </NavigationMenu.Item>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item className="navigation-menu-item">
              <Dialog.Root
                open={dialogOpen}
                onOpenChange={() => setDialogOpen(!dialogOpen)}
              >
                <Dialog.Trigger className="sign-in-button">
                  <span>Sign in</span>
                  <span>Register</span>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="signIn-dialog-overlay" />
                  <Dialog.Content className="signIn-dialog-content">
                    {toggleSignInRegister ? (
                      <SignInForm
                        handleSignInRegisterToggle={handleSignInRegisterToggle}
                      />
                    ) : (
                      <RegisterForm
                        handleSignInRegisterToggle={handleSignInRegisterToggle}
                      />
                    )}
                    <Dialog.Close asChild>
                      <span className="material-symbols-outlined signIn-dialog-close">
                        close
                      </span>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </NavigationMenu.Item>
          )}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </>
  );
}
