import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";

import "./SignInDialog.css";

export default function index() {
  return (
    <>
      <div className="signIn-dialog-logo"></div>
      <div className="signIn-dialog-title">Welcome to Airbnp!</div>
      <div className="signIn-dialog-description">
        Sign in to view your account
      </div>
      <Form.Root>
        <Form.Field className="signIn-dialog-form-field" name="email">
          <Form.Label>Email</Form.Label>
          <Form.Message className="signIn-dialog-form-message" match="">
            Please enter your email
          </Form.Message>
          <Form.Control asChild>
            <input type="text" />
          </Form.Control>
        </Form.Field>
        <Form.Field className="signIn-dialog-form-field" name="password">
          <Form.Label>Password</Form.Label>
          <Form.Message className="signIn-dialog-form-message" match="">
            Please enter your email
          </Form.Message>
          <Form.Control asChild>
            <input type="password" />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button
            className="signIn-dialog-form-button"
            style={{ marginTop: 10 }}
          >
            Sign in
          </button>
        </Form.Submit>
      </Form.Root>
    </>
  );
}
