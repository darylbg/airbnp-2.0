import React, { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { Toaster } from 'react-hot-toast';

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import PersonalInfo from "./components/AccountSubComponents/PersonalInfo";
import LoginAndSecurity from "./components/AccountSubComponents/LoginAndSecurity";
import AccountComponentsMenu from "./components/AccountSubComponents/AccountComponentsMenu";
import PaymentInfo from "./components/AccountSubComponents/PaymentInfo";
import BookingHistory from "./components/AccountSubComponents/BookingHistory";
import PrivacyPolicy from "./components/AccountSubComponents/PrivacyPolicy";
import TermsAndConditions from "./components/AccountSubComponents/TermsAndConditions";
import MobileNavbar from "./components/MobileNavbar";
import "./Global.css";

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="app-div">
          <Navbar />
          <div className="app-pages">
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="about" element={<About />}></Route>
              <Route path="contact" element={<Contact />}></Route>
              <Route path="dashboard" element={<Dashboard />}></Route>
              <Route path="profile" element={<Profile />}></Route>
              <Route path="account" element={<Account />}>
                <Route path="" element={<AccountComponentsMenu />} />
                <Route path="personal-info" element={<PersonalInfo />} />
                <Route
                  path="login-and-security"
                  element={<LoginAndSecurity />}
                />
                <Route path="booking-history" element={<BookingHistory />} />
                <Route path="payment-info" element={<PaymentInfo />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route
                  path="terms-and-conditions"
                  element={<TermsAndConditions />}
                />
              </Route>
            </Routes>
            <MobileNavbar />
          </div>
          <Toaster
          position="bottom-right" 
          toastOptions={{
            className: "toast",
            duration: 2000000
          }}/>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
