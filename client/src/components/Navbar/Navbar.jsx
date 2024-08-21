import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import authService from "../../utils/auth";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import DialogComponent from "../PrimitiveComponents/DialogComponent/DialogComponent";
import Logo from "../../assets/images/logo_colour_50px.png";
import "./Navbar.css";
import LoginRegisterComponent from "../LoginRegisterComponents/LoginRegisterComponent";
export default function Navbar({}) {

  const [scrolled, setScrolled] = useState(false);
  const [loginRegisterDialog, setLoginRegisterDialog] = useState(false);

  // querying redux for logged in user
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.userDetails.byId);

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

  const logout = (e) => {
    e.preventDefault();
    authService.logout().then(() => {
      window.location.assign("/"); // This reloads the page and redirects to the root URL
    });
  };

  const openLoginRegisterDialog = (e) => {
    e.preventDefault();
    setLoginRegisterDialog(true);
  };

  const closeLoginRegisterDialog = (e) => {
    e.preventDefault();
    setLoginRegisterDialog(false);
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
            <ButtonComponent type="button" action={openLoginRegisterDialog} className="default-button">Login</ButtonComponent>
          )}
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <DialogComponent
        className="content-width-dialog login-register-dialog"
        backdropClosable={true}
        dialogState={loginRegisterDialog}
        closeDialog={closeLoginRegisterDialog}
        icon="close"
        dialogHeader="Login/Register"
      >
        <LoginRegisterComponent
          // closeLoginRegisterDialog={closeLoginRegisterDialog}
          setLoginRegisterDialog={setLoginRegisterDialog}
        />
      </DialogComponent>
    </>
  );
}
