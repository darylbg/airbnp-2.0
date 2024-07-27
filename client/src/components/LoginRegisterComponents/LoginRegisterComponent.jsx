import React, {useState} from "react";
import RegisterForm from "./RegisterForm/RegisterForm";
import SignInForm from "./SignInForm/SignInForm";
import "./LoginRegisterComponent.css";

export default function LoginRegisterComponent({closeLoginRegisterDialog}) {
  const [toggleSignInRegister, setToggleSignInRegister] = useState(true);
  const handleSignInRegisterToggle = (e) => {
    e.preventDefault();
    setToggleSignInRegister(!toggleSignInRegister);
  };
  return (
    <div className="login-register-wrapper">
      {/* login register */}
      {toggleSignInRegister ? (
        <SignInForm handleSignInRegisterToggle={handleSignInRegisterToggle} closeLoginRegisterDialog={closeLoginRegisterDialog} />
      ) : (
        <RegisterForm handleSignInRegisterToggle={handleSignInRegisterToggle} closeLoginRegisterDialog={closeLoginRegisterDialog} />
      )}
    </div>
  );
}
