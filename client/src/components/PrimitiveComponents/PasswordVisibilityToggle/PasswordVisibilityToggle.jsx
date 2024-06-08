import React from "react";

export default function PasswordVisibilityToggle({ action }) {
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    
    const thisInput = e.currentTarget.previousElementSibling;
    const thisInputIcon = e.currentTarget.querySelector("span");

    if (thisInput.type === "password") {
      thisInput.setAttribute("type", "text");
      thisInputIcon.textContent = "visibility";
    } else if (thisInput.type === "text") {
      thisInput.setAttribute("type", "password");
      thisInputIcon.textContent = "visibility_off";
    }

    // Call the action function if it's provided
    if (typeof action === "function") {
      action(e);
    }
  };

  return (
    <button
      type="button"
      className="password-visibility-toggle test"
      onClick={togglePasswordVisibility}
    >
      <span className="material-symbols-outlined">visibility_off</span>
    </button>
  );
}
