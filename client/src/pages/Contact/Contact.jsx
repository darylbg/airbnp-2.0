import React from "react";
import Footer from "../../components/Footer/Footer";
import "./Contact.css";
import EmailIcon from "../../assets/icons/ContactIcons/email.png";
import ChatIcon from "../../assets/icons/ContactIcons/live-chat.png";
import PhoneIcon from "../../assets/icons/ContactIcons/support.png";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-page-content">
        <div className="contact-options">
          <h1>How can we help?</h1>
          <div className="contact-cards">
            <div className="contact-option">
              <img src={EmailIcon} alt="email icon" />
              <span>Email us</span>
            </div>
            <div className="contact-option">
              <img src={ChatIcon} alt="chat icon" />
              <span>Chat with an agent</span>
            </div>
            <div className="contact-option">
              <img src={PhoneIcon} alt="phone icon" />
              <span>Call us</span>
            </div>
          </div>
          <div className="contact-chat-input">
            <input type="text" placeholder="Send a message..." />
            <button>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="contact-page-faqs">
          <h1>FAQ's</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
}
