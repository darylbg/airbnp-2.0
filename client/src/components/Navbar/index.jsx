import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Auth from "../../utils/auth";

import SignInForm from "../SignInForm";
import RegisterForm from "../RegisterForm";
import Logo from "../../assets/images/logo_colour_50px.png";
import "./Navbar.css";

export default function Navbar({}) {
  const [toggleSignInRegister, setToggleSignInRegister] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);

  const navigate = useNavigate();

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
    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, []);

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
      <NavigationMenu.Root className={`navigation-menu-root ${scrolled ? "window-scrolled" : "" }`}>
        {/* logo */}
        <div className="navigation-menu-logo">
          <Link to="/"><img src={Logo}></img>AIRBNP</Link>
        </div>
        {/* centered search button */}
        <div className="navigation-menu-search">
          <Link to="/search" className="">
            Search
            {/* <MagnifyingGlassIcon /> */}
            <span className="material-symbols-outlined">
              <span className="material-symbols-outlined">location_searching</span>
            </span>
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
          {isLoggedIn ? (
            <NavigationMenu.Item className="navigation-menu-item navigation-menu-dropdown">
              <NavigationMenu.Trigger className="navigation-menu-trigger">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                  alt="Profile"
                />
                {/* <span className="material-symbols-outlined">menu</span> */}
                <HamburgerMenuIcon
                  className="hamburger-menu-icon"
                  aria-hidden
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="navigation-menu-content">
                <NavigationMenu.Item className="navigation-menu-item" asChild>
                  <NavigationMenu.Link asChild>
                    <Link
                      to="/profile"
                      className="navigation-menu-link dropdown-menu-link"
                    >
                      Profile
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
                    <Link
                      className="navigation-menu-link dropdown-menu-link"
                      onClick={logout}
                    >
                      Logout
                    </Link>
                  </NavigationMenu.Link>
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
                  Sign in
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
