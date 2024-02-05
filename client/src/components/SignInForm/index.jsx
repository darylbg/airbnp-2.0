import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";

import "./SignInRegisterForms.css";

export default function SignInForm({ handleSignInRegisterToggle }) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // toggle password input between hidden and visible text
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <>
      <div className="signIn-form-header">
        <div className="signIn-form-logo"></div>
        <h2>Welcome to Airbnp!</h2>
        <p>Sign in to view your account</p>
      </div>
      <Form.Root className="signIn-form">
        <Form.Field className="form-field" name="email">
          <Form.Label className="field-label">Email</Form.Label>
          <Form.Control asChild>
            <input type="text" placeholder="johnsmith@mail.com" />
          </Form.Control>
          <Form.Message className="field-message" match="">
            Please enter your email
          </Form.Message>
        </Form.Field>
        <Form.Field className="form-field" name="password">
          <Form.Label className="field-label">Password</Form.Label>
          <div className="password-input-wrapper">
            <Form.Control asChild>
              <input type={passwordVisibility? "text" : "password"} placeholder="" />
            </Form.Control>
            <div className="password-visibility">
              <span
                className="material-symbols-outlined"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility? "visibility" : "visibility_off"}
              </span>
            </div>
          </div>
          <Form.Message className="field-message" match="">
            Please enter your email
          </Form.Message>
        </Form.Field>
        <Form.Field className="form-submit-button">
          <Form.Submit asChild>
            <button>
              <strong>Sign in</strong>
            </button>
          </Form.Submit>
        </Form.Field>
      </Form.Root>
      <div className="signInRegister-form-toggle">
        <p>
          Don't have an account?{" "}
          <span onClick={handleSignInRegisterToggle}>
            <strong>Register here</strong>
          </span>
        </p>
      </div>
    </>
  );
}
