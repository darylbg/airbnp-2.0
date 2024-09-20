import React, { useState, useEffect, useContext } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { HelperFunctionsProvider } from "./HelperFunctions";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Account from "./pages/Account/Account";
import Profile from "./pages/Profile/Profile";
import PersonalInfo from "./components/AccountSubComponents/PersonalInfo/PersonalInfo";
import LoginAndSecurity from "./components/AccountSubComponents/LoginAndSecurity/LoginAndSecurity";
import AccountComponentsMenu from "./components/AccountSubComponents/AccountComponentsMenu/AccountComponentsMenu";
import PaymentInfo from "./components/AccountSubComponents/PaymentInfo/PaymentInfo";
import BookingHistory from "./components/AccountSubComponents/BookingHistory/BookingHistory";
import PrivacyPolicy from "./components/AccountSubComponents/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./components/AccountSubComponents/TermsAndConditions/TermsAndConditions";
import MobileNavbar from "./components/MobileNavbar/MobileNavbar";
import "./Global.css";
import Bookings from "./components/DashboardComponents/Bookings/Bookings";
import Listings from "./components/DashboardComponents/Listings/Listings";
import Notifications from "./components/DashboardComponents/Notifications/Notifications";
import Payments from "./components/DashboardComponents/Payments/Payments";
import Reviews from "./components/DashboardComponents/Reviews/Reviews";
import Checkout from "./components/BookingCycleComponents/Checkout/Checkout";
import GuestReservations from "./components/DashboardComponents/Bookings/GuestReservations/GuestReservations";
import MyBookingHistory from "./components/DashboardComponents/Bookings/MyBookingHistory/MyBookingHistory";
import BookingsOverview from "./components/DashboardComponents/Bookings/BookingsOverview/BookingsOverview";
import ChatBot from "./components/PrimitiveComponents/ChatBot/ChatBot";
import { useSelector } from "react-redux";
import * as Realm from "realm-web";
import NotificationsWatcher from "./components/DashboardComponents/Notifications/NotificationsWatcher";

const httpLink = createHttpLink({
  // development: "http://localhost:3001/graphql", production: "/graphql"
  uri: process.env.REACT_APP_HTTPLINK_URI,
});

console.log(process.env.REACT_APP_HTTPLINK_URI);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      // authorization: token ? `${token}` : "",
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// setting up realtime events for notifications collection mongodb atlas

// Create the Application
const app = new Realm.App({ id: "application-0-alpetok" });

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isChatBotOpen = useSelector((state) => state.chatBot.open);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const [user, setUser] = useState();
  const [events, setEvents] = useState([]);
  // console.log("mongodb notification events", events);

  useEffect(() => {
    const login = async () => {
      // Authenticate anonymously
      const user = await app.logIn(Realm.Credentials.anonymous());
      setUser(user); // Connect to the database

      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("test").collection("notifications"); // Everytime a change happens in the stream, add it to the list of events

      for await (const change of collection.watch()) {
        setEvents((events) => [...events, change]);
      }
    };
    login();
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <ApolloProvider client={client}>
      <HelperFunctionsProvider>
      <Router>
        <div className="app-div">
          <Navbar />
          <div className="app-pages">
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="search" element={<Search />}></Route>
              <Route path="about" element={<About />}></Route>
              <Route path="contact" element={<Contact />}></Route>
              <Route path="dashboard" element={<Dashboard />}>
                <Route path="bookings" element={<Bookings />}>
                  <Route path="" element={<BookingsOverview />} />
                  <Route
                    path="my-booking-history"
                    element={<MyBookingHistory />}
                  />
                  <Route
                    path="guest-reservations"
                    element={<GuestReservations />}
                  />
                </Route>
                <Route path="listings" element={<Listings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="payments" element={<Payments />} />
                <Route path="reviews" element={<Reviews />} />
              </Route>

              <Route path="my-profile" element={<Profile myProfile={true} />}></Route>
              <Route path="profile/:userId" element={<Profile myProfile={false} />}></Route>

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
              <Route path="checkout" element={<Checkout />} />
            </Routes>
            <MobileNavbar />
          </div>
          <Toaster
            position={windowSize > 768 ? "bottom-left" : "top-right"}
            toastOptions={{
              className: "toast",
            }}
          />
          <NotificationsWatcher events={events} />
          {isLoggedIn && isChatBotOpen && <ChatBot />}
        </div>
      </Router>
      </HelperFunctionsProvider>
    </ApolloProvider>
  );
}

export default App;
