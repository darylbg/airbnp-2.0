import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import Auth from "../../utils/auth";
import { login_user } from "../../reducers/authReducer";
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
    defaultValues: {
      // firstName: "",
      // lastName: "",
      // email: "",
      // password: "",
    },
  });
  console.log(errors)

  const dispatch = useDispatch();

  const [registerUser] = useMutation(REGISTER, {
    onError: (error) => {
      console.log("Registration failed:", error);
    },
    onCompleted: (data) => {
      // Handle successful registration here, such as logging in the user
      console.log("User registered successfully:", data);
      const { token } = data.register;
      Auth.login(token);
      dispatch(login_user(token));
      // Redirect or update UI as needed
    }
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({ variables: { input: data } });
    } catch (error) {
      console.log("Error registering user:", error);
    }
  };


  
  return (
    <div className="signInRegister-form">
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
                {...register("firstName", {
                  required: "This is required",
                })}
            />
          </Form.Control>
          <div className="field-message">{errors.firstName?.message}</div>
        </Form.Field>
        <Form.Field className="form-field" name="lastName">
          <Form.Label className="field-label">Last name</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
                {...register("lastName", {
                  required: "This is required",
                })}
            />
          </Form.Control>
          <div className="field-message" >
            {errors.lastName?.message}
          </div>
        </Form.Field>
        <Form.Field className="form-field" name="email">
          <Form.Label className="field-label">Email</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
                {...register("email", {
                  required: "This is required",
                })}
            />
          </Form.Control>
          <div className="field-message" >
            {errors.email?.message}
          </div>
        </Form.Field>
        <Form.Field className="form-field" name="password">
          <Form.Label className="field-label">Password</Form.Label>
          <div className="password-input-wrapper">
            <Form.Control asChild>
              <input
                type={passwordVisibility ? "text" : "password"}
                {...register("password", {
                  required: "This is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
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
          <div className="field-message" >
            {errors.password?.message}
          </div>
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
    </div>
  );
}

