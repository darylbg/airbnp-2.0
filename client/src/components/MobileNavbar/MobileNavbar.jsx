import React, { useState, useEffect, forwardRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { HomeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import authService from "../../utils/auth";

import SignInForm from "../SignInForm/SignInForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import "./MobileNavbar.css";

const MobileNavbar = forwardRef((props, ref) => {
  const [toggleSignInRegister, setToggleSignInRegister] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toggleAccountSubmenu, setToggleAccountSubmenu] = useState(false);

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
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
              <span className="mobile-navbar-text">Contact</span>
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
                    src={user.user_image}
                    alt="user image"
                    className="mobile-navbar-image-icon"
                  />
                  {/* <span className="material-symbols-outlined mobile-navbar-icon">
                    account_circle
                  </span> */}
                  <span className="mobile-navbar-text">User</span>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item className="mobile-navbar-item">
              <NavigationMenu.Link className="mobile-navbar-link" asChild>
                <Dialog.Root
                  open={dialogOpen}
                  onOpenChange={() => setDialogOpen(!dialogOpen)}
                  ref={ref}
                >
                  <Dialog.Trigger className="sign-in-button mobile-signIn-button clickable">
                    <span className="material-symbols-outlined mobile-navbar-icon">
                      account_circle
                    </span>
                    <span className="mobile-navbar-text">Sign in</span>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="signIn-dialog-overlay" />
                    <Dialog.Content className="signIn-dialog-content">
                      {toggleSignInRegister ? (
                        <SignInForm
                          handleSignInRegisterToggle={
                            handleSignInRegisterToggle
                          }
                        />
                      ) : (
                        <RegisterForm
                          handleSignInRegisterToggle={
                            handleSignInRegisterToggle
                          }
                        />
                      )}
                      <Dialog.Close asChild className=" clickable">
                        <span className="material-symbols-outlined signIn-dialog-close">
                          close
                        </span>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
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
                  to="/profile"
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
              to="/dashboard"
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
    </>
  );
});

export default MobileNavbar;
