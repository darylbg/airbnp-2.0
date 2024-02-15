import React, { useEffect, useState } from "react";
import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Auth from "../../utils/auth";
import { login_user } from "../../reducers/authReducer";
import { REGISTER_MUTATION } from "../../utils/mutations";

import "../SignInForm/SignInRegisterForms.css";

export default function RegisterForm({
  handleSignInRegisterToggle,
  handleSignInRegisterSuccess,
  setDialogOpen,
}) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    criteriaMode: "all",
  });

  const [registerMutation, { error }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();
  console.log("email errors", errors.email);
  const onSubmit = async (formData) => {
    const displayName = formData.firstName + formData.lastName;
    try {
      const registeredUser = await registerMutation({
        variables: {
          userData: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            display_name: displayName,
            email: formData.email,
            password: formData.password,
          },
        },
      });

      console.log("registeredUser", registeredUser);

      Auth.login(registeredUser.data.register.token);
      // handleSignInRegisterSuccess();
      // setDialogOpen(false)
    } catch (error) {
      console.log(error.graphQLErrors);
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const firstGraphQLError = error.graphQLErrors[0];
        setError("graphQL", {
          type: "graphQL",
          message: "graphql error",
        });
      }
    }
  };

  // Sets validation on email input. onchange, clears the grpahql errors and resets required check from useForm
  const handleEmailValidation = (e) => {
    setValue("email", e.target.value, {
      shouldValidate: true,
    });
    clearErrors("graphQL");
  };

  // toggle password input between hidden and visible text
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <div className="signInRegister-form">
      <div className="register-form-header">
        <div className="register-form-logo"></div>
        <h2>Welcome to Airbnp!</h2>
        <p>Sign up to your account here</p>
      </div>
      <Form.Root className="register-form" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="field-message">{errors.lastName?.message}</div>
        </Form.Field>
        <Form.Field className="form-field" name="email">
          <Form.Label className="field-label">Email</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("email", {
                required: "This is required",
              })}
              onChange={handleEmailValidation}
            />
          </Form.Control>
          <div className="field-message">{errors.email?.message}</div>
          <div className="field-message">{errors.graphQL?.message}</div>
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
          <div className="field-message">{errors.password?.message}</div>
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
