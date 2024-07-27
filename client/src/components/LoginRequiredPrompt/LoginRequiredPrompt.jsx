import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import SignInForm from "../LoginRegisterComponents/SignInForm/SignInForm";
import RegisterForm from "../LoginRegisterComponents/RegisterForm/RegisterForm";

export default function LoginRequiredPrompt() {
  const [toggleSignInRegister, setToggleSignInRegister] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleSignInRegisterToggle = (e) => {
    e.preventDefault();
    setToggleSignInRegister(!toggleSignInRegister);
  };
  return (
    <div>
      <Dialog.Root
      open={dialogOpen}
      onOpenChange={() => setDialogOpen(!dialogOpen)}
      >
        {/* <Dialog.Trigger className="sign-in-button">Sign in</Dialog.Trigger> */}
        <Dialog.Portal>
          <Dialog.Overlay className="signIn-dialog-overlay" />
          <Dialog.Content className="signIn-dialog-content">
            {toggleSignInRegister ? (
              <SignInForm
                handleSignInRegisterToggle={handleSignInRegisterToggle}
              />
            ) : (
              <RegisterForm
                handleSignInRegisterToggle={handleSignInRegisterToggle}
              />
            )}
            <Dialog.Close asChild>
              <span className="material-symbols-outlined signIn-dialog-close">
                close
              </span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
