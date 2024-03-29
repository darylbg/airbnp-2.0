import React, { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MobileNavbar from "./components/MobileNavbar";
import "./App.css";

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
              <Route path="/about" element={<About />}></Route>
              <Route path="/contact" element={<Contact />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
            </Routes><MobileNavbar />
          </div>
          
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
