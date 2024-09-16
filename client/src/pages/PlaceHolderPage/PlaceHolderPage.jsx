import React, { useState } from "react";
import DialogComponent from "../../components/PrimitiveComponents/DialogComponent/DialogComponent";
// import DialogComponent from "../../components/PrimitiveComponents/DialogComponent/DialogComponent";
import LoginRegisterComponent from "../../components/LoginRegisterComponents/LoginRegisterComponent";
import "./PlaceHolderPage.css";
import PlaceHolderImage from "../../assets/images/placeholder-page.png"

export default function PlaceHolderPage({ title }) {
  const [loginRegisterDialog, setLoginRegisterDialog] = useState(true);
  const closeLoginRegisterDialog = () => {
    setLoginRegisterDialog(false);
  };
  return (
    <div className="place-holder-page">
      <h2>{title}</h2>
      {/* <img src={PlaceHolderImage} alt="" /> */}
      <DialogComponent
        className="content-width-dialog login-register-dialog"
        backdropClosable={true}
        dialogState={loginRegisterDialog}
        closeDialog={closeLoginRegisterDialog}
        icon="close"
        dialogHeader="Login/Register"
      >
        <LoginRegisterComponent
          setLoginRegisterDialog={setLoginRegisterDialog}
        />
      </DialogComponent>
    </div>
  );
}
