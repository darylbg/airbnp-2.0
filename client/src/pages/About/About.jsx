import React from "react";
import Footer from "../../components/Footer/Footer";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-page-content">
        <div className="about-page-summary">
          <div className="about-summary-img">
            <img
              src="https://i.kym-cdn.com/entries/icons/original/000/045/007/thousandyard.jpg"
              alt=""
            />
            <h1>I NEED TO GO</h1>
          </div>
          <h2 className="subtitle">Fear the public shits no more</h2>
          <p className="description">
            Welcome to Airbnp, your go-to platform for booking clean, private
            bathrooms whenever you’re on the go. Whether you're traveling, out
            exploring, or just need a quick, comfortable place to refresh,
            Airbnp connects you with accessible and well-maintained restrooms
            in public areas, hotels, cafes, and more. Each listing includes
            photos, amenities, and real-time availability, allowing you to find
            the perfect bathroom experience to suit your needs. Simply browse
            nearby options, book with a tap, and enjoy peace of mind wherever
            your day takes you. At Airbnp, we’re here to make finding a clean
            bathroom easy, reliable, and stress-free.
          </p>
        </div>
        {/* <div className="about-page-steps">
          <h2>How it works</h2>
        </div>
        <div className="social-links">
          <h2>Socials</h2>
          <div className="social-links-group">
            
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
