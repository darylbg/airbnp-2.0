import React, { useState } from "react";
import RegisterForm from "./RegisterForm/RegisterForm";
import SignInForm from "./SignInForm/SignInForm";
import "./LoginRegisterComponent.css";

export default function LoginRegisterComponent({
  // closeLoginRegisterDialog,
  handleLoginToCheckout,
  setLoginRegisterDialog,
}) {
  const [toggleSignInRegister, setToggleSignInRegister] = useState("signIn");
  const handleSignInRegisterToggle = (e) => {
    e.preventDefault();
    setToggleSignInRegister(!toggleSignInRegister);
  };
  return (
    <div className="login-register-wrapper">
      {toggleSignInRegister ? (
        <SignInForm
          handleLoginToCheckout={handleLoginToCheckout}
          setLoginRegisterDialog={setLoginRegisterDialog}
        />
      ) : (
        <RegisterForm
          handleLoginToCheckout={handleLoginToCheckout}
          setLoginRegisterDialog={setLoginRegisterDialog}
        />
      )}
      <div className="signInRegister-form-toggle">
        <p>
          <span>{toggleSignInRegister ? "Don't have an account? " : "Already have an account? "}</span>
          <strong onClick={handleSignInRegisterToggle}>
            {toggleSignInRegister ? "Register" : "Sign in"}
          </strong>
        </p>
      </div>
    </div>
  );
}
