import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ApolloError, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { SIGN_IN_MUTATION } from "../../utils/mutations";

import "./SignInRegisterForms.css";
import { login_user } from "../../reducers/authReducer";
import { graphQLResultHasError } from "@apollo/client/utilities";

export default function SignInForm({ handleSignInRegisterToggle }) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [signInMutation] = useMutation(SIGN_IN_MUTATION);

  const handleSignInSubmit = async (formData) => {
    try {
      const loggedInUser = await signInMutation({
        variables: { email: formData.email, password: formData.password },
      });
      const loggedInUserData = loggedInUser.data.login
      console.log("logged in", loggedInUserData);
      dispatch(
        login_user({
          token: loggedInUserData.token,
          id: loggedInUserData.user.id,
          ...loggedInUserData.user
        })
      )
    } catch (error) {
      // console.log(error);
      if (error.graphQLErrors) {
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          const firstGraphQLErrorCode = error.graphQLErrors[0].extensions.code;
          switch (firstGraphQLErrorCode) {
            case "NO_USER_FOUND_ERROR":
              setError("noUserFoundError", {
                type: "noUserFoundError",
                message: "User not found, please register",
              });
              break;
            case "INCORRECT_PASSWORD_ERROR":
              setError("incorrectPasswordError", {
                type: "incorrectPasswordError",
                message: "Incorrect password",
              });
              break;
            default:
              console.log("sign in error");
          }
        }
      } else {
        console.log(error);
        setError("otherLoginError", {
          type: "otherLoginError",
          message: "Something went wrong, please try again",
        });
      }
    }
  };

  const handleEmailValidation = (e) => {
    setValue("email", e.target.value, {
      shouldValidate: true,
    });
    clearErrors("noUserFoundError");
    clearErrors("incorrectPasswordError");
  };

  const handlePasswordValidation = (e) => {
    setValue("password", e.target.value, {
      shouldValidate: true,
    });
    clearErrors("incorrectPasswordError");
  };

  // toggle password input between hidden and visible text
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <div className="signInRegister-form">
      <div className="signInRegister-form-header">
        <div className="logo"></div>
        <h2>Welcome to Airbnp!</h2>
        <p>Sign in to view your account</p>
      </div>
      <Form.Root
        className="signIn-form"
        onSubmit={handleSubmit(handleSignInSubmit)}
      >
        <Form.Field className="form-field" name="email">
          <Form.Label className="field-label">Email</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("email", {
                required: "This is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              onChange={handleEmailValidation}
            />
          </Form.Control>
          <div className="field-message">{errors.email?.message}</div>
          <div className="field-message">{errors.noUserFoundError?.message}</div>
        </Form.Field>
        <Form.Field className="form-field" name="password">
          <Form.Label className="field-label">Password</Form.Label>
          <div className="password-input-wrapper">
            <Form.Control asChild>
              <input
                type={passwordVisibility ? "text" : "password"}
                {...register("password", { required: "This is required" })}
                onChange={handlePasswordValidation}
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
          <div className="field-message">{errors.password?.message}</div>
          <div className="field-message">{errors.incorrectPasswordError?.message}</div>
          <div className="field-message">{errors.otherLoginError?.message}</div>
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
    </div>
  );
}
