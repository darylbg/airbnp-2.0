import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";

import { REGISTER } from "../../utils/mutations";

import "../SignInForm/SignInRegisterForms.css";

export default function RegisterForm({ handleSignInRegisterToggle }) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // toggle password input between hidden and visible text
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   password: "",
    // },
  });

  const onSubmit = (data) => {
    console.log("formData", data);
  };

  return (
    <>
      <div className="register-form-header">
        <div className="register-form-logo"></div>
        <h2>Welcome to Airbnp!</h2>
        <p>Sign up to your account here</p>
      </div>
      <Form.Root className="register-form" 
      onSubmit={handleSubmit(onSubmit)}
      >
        <Form.Field className="form-field" name="firstName">
          <Form.Label className="field-label">First name</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              placeholder="John"
                {...register("firstName", {
                  required: "This is required",
                })}
            />
          </Form.Control>
          <Form.Message className="field-message">
            {errors.firstName?.message}
          </Form.Message>
        </Form.Field>
        <Form.Field className="form-field" name="lastName">
          <Form.Label className="field-label">Last name</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              placeholder="Smith"
                {...register("lastName", {
                  required: "This is required",
                })}
            />
          </Form.Control>
          <Form.Message className="field-message" >
            {errors.lastName?.message}
          </Form.Message>
        </Form.Field>
        <Form.Field className="form-field" name="email">
          <Form.Label className="field-label">Email</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              placeholder="johnsmith@mail.com"
                {...register("email", {
                  required: "This is required",
                })}
            />
          </Form.Control>
          <Form.Message className="field-message" >
            {errors.email?.message}
          </Form.Message>
        </Form.Field>
        <Form.Field className="form-field" name="password">
          <Form.Label className="field-label">Password</Form.Label>
          <div className="password-input-wrapper">
            <Form.Control asChild>
              <input
                type={passwordVisibility ? "text" : "password"}
                placeholder="Must have at least 6 characters"
                {...register("password", {
                  required: "This is required",
                  minLength: { value: 8, message: "characters" },
                })}
              />
            </Form.Control>
            <div className="password-visibility">
              <span
                className="material-symbols-outlined"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility ? "visibility" : "visibility_off"}
              </span>
            </div>
          </div>
          <Form.Message className="field-message" >
            {errors.password?.message}
          </Form.Message>
        </Form.Field>
        <Form.Field className="form-submit-button">
          <Form.Submit asChild>
            <button>
              <strong>Register</strong>
            </button>
          </Form.Submit>
        </Form.Field>
      </Form.Root>
      <div className="signInRegister-form-toggle">
        <p>
          Already have an account?{" "}
          <span onClick={handleSignInRegisterToggle}>
            <strong>Sign in here</strong>
          </span>
        </p>
      </div>
    </>
  );
}

