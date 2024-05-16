import React from "react";
import * as Form from "@radix-ui/react-form";
import GetAllListings from "../../components/GetAllListings";

import LargeRoundButton from "../../components/PrimitiveComponents/LargeRoundButton/LargeRoundButton";
import HeroImage from "../../assets/images/HeroImage.jpg";
import Phone from "../../assets/images/phone.png";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero-section">
        <div className="hero-content">
          <div className="hero-content-text">
            <div className="text">
              <p className="subtitle-1">10,000+ available bathrooms for you.</p>
              <div className="title">
                <p className="section-Heading">Bathrooms available near you</p>
              </div>
              <p className="subtitle-2">Go out stress free</p>
            </div>
            <div className="search">
              <Form.Root className="hero-search-form">
                <Form.Field className="search-field">
                  <Form.Control asChild>
                    <input type="text" placeholder="Search address or city" />
                  </Form.Control>
                </Form.Field>
                <Form.Field className="search-button">
                  <Form.Submit asChild>
                    <LargeRoundButton className="hero-search-form-button">
                      Search closest locations
                    </LargeRoundButton>
                  </Form.Submit>
                </Form.Field>
              </Form.Root>
            </div>
          </div>
          <div className="hero-content-img">
            <img src={HeroImage} alt="" />
          </div>
        </div>
        <div className="hero-ticker">
          <div className="tick">
            <strong>10,000+ LOCATIONS GLOBALLY</strong>
          </div>
          <div className="tick">
            <strong>25,000+ USERS</strong>
          </div>
          <div className="tick">
            <strong>95 COUNTRIES</strong>
          </div>
          <div className="tick">
            <strong>FROM £1.00/VISIT</strong>
          </div>
          <div className="tick">
            <strong>10,000+ LOCATIONS GLOBALLY</strong>
          </div>
          <div className="tick">
            <strong>25,000+ USERS</strong>
          </div>
          <div className="tick">
            <strong>95 COUNTRIES</strong>
          </div>
          <div className="tick">
            <strong>FROM £1.00/VISIT</strong>
          </div>
        </div>
      </section>
      <section className="home-steps-section home-section">
        <div className="home-section-wrapper">
          <div className="section-heading">
            <p>How it works</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-img">
                <div className="step-index">1.</div>
              </div>
              <div className="step-text">
                <h1>Book online or on the app</h1>
                <p>Head to our website or book from your phone on our app.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-img">
                <div className="step-index">2.</div>
              </div>
              <div className="step-text">
                <h1>Book online or on the app</h1>
                <p>Head to our website or book from your phone on our app.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-img">
                <div className="step-index">3.</div>
              </div>
              <div className="step-text">
                <h1>Book online or on the app</h1>
                <p>Head to our website or book from your phone on our app.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="home-book-now-section home-section">
        <div className="background-pattern"></div>
        <div className="home-section-wrapper">
          <div className="book-now-section-text">
            <div className="section-heading">
              <p>Book now</p>
            </div>
            <div className="section-subheading">
              Instantly find close, clean bathrooms to use.
            </div>
            <LargeRoundButton className="test-button">
              Find nearest locations
            </LargeRoundButton>
          </div>
          <div className="book-now-section-img">
            <img src={Phone} alt="" />
          </div>
        </div>
      </section>
      <section className="home-faqs-section">faqs</section>
      <GetAllListings />
      hoem
    </div>
  );
}
