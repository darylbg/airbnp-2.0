import React, { useState, useEffect, forwardRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { HomeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import authService from "../../utils/auth";
import LoginRegisterComponent from "../LoginRegisterComponents/LoginRegisterComponent";
import DialogComponent from "../PrimitiveComponents/DialogComponent/DialogComponent";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import SignInForm from "../LoginRegisterComponents/SignInForm/SignInForm";
import RegisterForm from "../LoginRegisterComponents/RegisterForm/RegisterForm";
import "./MobileNavbar.css";

const MobileNavbar = forwardRef((props, ref) => {
  const [toggleSignInRegister, setToggleSignInRegister] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toggleAccountSubmenu, setToggleAccountSubmenu] = useState(false);

  // querying redux for logged in user
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.userDetails.byId);

  // set sign in form to default display when dialog is opened
  useEffect(() => {
    if (!dialogOpen) {
      setToggleSignInRegister(true);
    }
  }, [dialogOpen]);

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
  const [loginRegisterDialog, setLoginRegisterDialog] = useState(false);

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
      <NavigationMenu.Root className="mobile-navbar-root">
        <NavigationMenu.List className="mobile-navbar-list">
          <NavigationMenu.Item className="mobile-navbar-item">
            <NavLink
              to="/"
              onClick={() => setToggleAccountSubmenu(false)}
              className={({ isActive }) =>
                `mobile-navbar-link clickable ${isActive ? "active" : ""}`
              }
            >
              <span className="material-symbols-outlined mobile-navbar-icon">
                Home
              </span>
              <span className="mobile-navbar-text">Home</span>
            </NavLink>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="mobile-navbar-item">
            <NavLink
              to="/search"
              onClick={() => setToggleAccountSubmenu(false)}
              className={({ isActive }) =>
                `mobile-navbar-link clickable ${isActive ? "active" : ""}`
              }
            >
              <span className="material-symbols-outlined mobile-navbar-icon">
                Search
              </span>
              <span className="mobile-navbar-text">Search</span>
            </NavLink>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="mobile-navbar-item">
            <NavLink
              to="/about"
              onClick={() => setToggleAccountSubmenu(false)}
              className={({ isActive }) =>
                `mobile-navbar-link clickable ${isActive ? "active" : ""}`
              }
            >
              <span className="material-symbols-outlined mobile-navbar-icon">
                description
              </span>
              <span className="mobile-navbar-text">About</span>
            </NavLink>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="mobile-navbar-item">
            <NavLink
              to="/contact"
              onClick={() => setToggleAccountSubmenu(false)}
              className={({ isActive }) =>
                `mobile-navbar-link clickable ${isActive ? "active" : ""}`
              }
            >
              <span className="material-symbols-outlined mobile-navbar-icon">
                Call
              </span>
              <span className="mobile-navbar-text">Help center</span>
            </NavLink>
          </NavigationMenu.Item>
          {isLoggedIn ? (
            <NavigationMenu.Item className="mobile-navbar-item">
              <NavigationMenu.Link
                className="mobile-navbar-link clickable"
                asChild
              >
                {/* trigger submenu open/close */}
                <Link
                  onClick={() => setToggleAccountSubmenu(!toggleAccountSubmenu)}
                >
                  <img
                    src={currentUser.user_image}
                    alt="user image"
                    className="mobile-navbar-image-icon"
                  />
                  <span className="mobile-navbar-text">User</span>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item className="mobile-navbar-item">
            <ButtonComponent
              type="button"
              action={openLoginRegisterDialog}
              className="default-button mobile-navbar-link clickable mobile-nav-login-button"
            >
              <span className="mobile-navbar-icon material-symbols-outlined mobile-navbar-icon">
                account_circle
              </span>
              <span className="mobile-navbar-text">Login</span>
            </ButtonComponent></NavigationMenu.Item>
          )}
        </NavigationMenu.List>
        {/* mobile navbar account submenu popup */}
        {toggleAccountSubmenu ? (
          <NavigationMenu.Sub className="mobile-account-submenu">
            <NavigationMenu.List>
              <NavigationMenu.Item className="mobile-navbar-item">
                <NavLink
                  to="/account"
                  onClick={() => setToggleAccountSubmenu(false)}
                  className={({ isActive }) =>
                    `mobile-navbar-link clickable ${isActive ? "active" : ""}`
                  }
                >
                  <span className="material-symbols-outlined mobile-navbar-icon">
                    manage_accounts
                  </span>
                  <span className="mobile-navbar-text">Account</span>
                </NavLink>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="mobile-navbar-item">
                <NavLink
                  to="/my-profile"
                  onClick={() => setToggleAccountSubmenu(false)}
                  className={({ isActive }) =>
                    `mobile-navbar-link clickable ${isActive ? "active" : ""}`
                  }
                >
                  <span className="material-symbols-outlined mobile-navbar-icon">
                    account_circle
                  </span>
                  <span className="mobile-navbar-text">Profile</span>
                </NavLink>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="mobile-navbar-item">
                <NavLink
                  to="/dashboard/bookings"
                  onClick={() => setToggleAccountSubmenu(false)}
                  className={({ isActive }) =>
                    `mobile-navbar-link clickable ${isActive ? "active" : ""}`
                  }
                >
                  <span className="material-symbols-outlined mobile-navbar-icon">
                    dashboard_customize
                  </span>
                  <span className="mobile-navbar-text">Dashboard</span>
                </NavLink>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="mobile-navbar-item">
                <Link onClick={logout} className="mobile-navbar-link clickable">
                  {" "}
                  <span className="material-symbols-outlined mobile-navbar-icon">
                    logout
                  </span>
                  <span className="mobile-navbar-text">Logout</span>
                </Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Sub>
        ) : null}
      </NavigationMenu.Root>
      <DialogComponent
        className="full-width-dialog login-register-dialog"
        backdropClosable={true}
        dialogState={loginRegisterDialog}
        closeDialog={closeLoginRegisterDialog}
        icon="close"
        dialogHeader="Login/Register"
      >
        <LoginRegisterComponent
          setLoginRegisterDialog={setLoginRegisterDialog}
        />
      </DialogComponent>
    </>
  );
});

export default MobileNavbar;
