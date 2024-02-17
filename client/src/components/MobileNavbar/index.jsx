import React, { useState, useEffect, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { HomeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Auth from "../../utils/auth";

import SignInForm from "../SignInForm";
import RegisterForm from "../RegisterForm";
import "./MobileNavbar.css";

const MobileNavbar = forwardRef((props, ref) => {
  const [toggleSignInRegister, setToggleSignInRegister] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {isLoggedIn} = useSelector((state) => state.auth);
  console.log(isLoggedIn)
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
    Auth.logout();
    navigate("/");
  };

  return (
    <>
    <NavigationMenu.Root className="mobile-navbar-root">
      <NavigationMenu.List className="mobile-navbar-list">
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/">
              <span className="material-symbols-outlined mobile-navbar-icon">
                Home
              </span>
              <span className="mobile-navbar-text">Home</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/search">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">
                Search
              </span>
              <span className="mobile-navbar-text">Search</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/about">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">
                description
              </span>
              <span className="mobile-navbar-text">About</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/contact">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">
                Call
              </span>
              <span className="mobile-navbar-text">Contact</span>
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        {isLoggedIn ? (
          <NavigationMenu.Item className="mobile-navbar-item">
          <NavigationMenu.Link className="mobile-navbar-link" asChild>
            <Link to="/account">
              {" "}
              <span className="material-symbols-outlined mobile-navbar-icon">
                account_circle
              </span>
              <span className="mobile-navbar-text">Account</span>
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
              <Dialog.Trigger className="sign-in-button mobile-signIn-button">
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
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        )}
      </NavigationMenu.List>
    </NavigationMenu.Root>
    </>
  );
});

export default MobileNavbar;


