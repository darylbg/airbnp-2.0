import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../../../utils/auth";
import { loginUser } from "../../../reducers/authReducer";
import { setUserDetails } from "../../../reducers/userDetailsReducer";
import { REGISTER_MUTATION } from "../../../utils/mutations";
import toast from "react-hot-toast";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import "../SignInForm/SignInRegisterForms.css";

export default function RegisterForm({
  handleSignInRegisterToggle,
  closeLoginRegisterDialog,
  handleLoginToCheckout
}) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: { errors, isSubmitSuccessful },
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
  const dispatch = useDispatch();

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
            gender: "",
            user_image: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
            user_listings: [],
            saved_listings: [],
            notifications: [],
            reviews: [],
            payments: [],
            booking_history: [],
          },
        },
      });
      const registeredUserData = registeredUser.data.register;
      const userId = registeredUserData.user.id;

      // dispatch to updated redux store
      dispatch(loginUser({id: userId, token: registeredUserData.token}));
      dispatch(setUserDetails(registeredUserData.user));
      closeLoginRegisterDialog();

      // if loggin in to checkout, redirect to checkout page
      handleLoginToCheckout();

      // set token in local storage
      Auth.login(registeredUser.data.register.token);
      toast.success(<ToastComponent message={`Welcome ${registeredUserData.firstName}.`}/>);
    } catch (error) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const firstGraphQLErrorCode = error.graphQLErrors[0].extensions.code;
        setError("graphQLError", {
          type: "graphQLError",
          message: `${
            firstGraphQLErrorCode === "DUPLICATE_EMAIL_ERROR"
              ? "Email already in use"
              : "Error, please try again"
          }`,
        });
      }
    }
  };

  // Sets validation on email input. onchange, clears the grpahql errors and resets required check from useForm
  const handleEmailValidation = (e) => {
    setValue("email", e.target.value, {
      shouldValidate: true,
    });
    clearErrors("graphQLError");
  };

  // reset fields to empty after successful registration
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

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
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              onChange={handleEmailValidation}
            />
          </Form.Control>
          <div className="field-message">{errors.email?.message}</div>
          <div className="field-message">{errors.graphQLError?.message}</div>
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
