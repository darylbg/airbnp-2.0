import React, { useRef, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AddressSearch from "../../AddressSearch/AddressSearch";
import PrimaryButton from "../../PrimitiveComponents/PrimaryButton/PrimaryButton";
import "./Bookings.css";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";

export default function Bookings() {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setModal(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <>
      <DashboardHeader
        title="Bookings"
        subtitle="Manage your bookings"
        icon="today"
      ></DashboardHeader>
      <div
        style={{
          // backgroundColor: "white",
          display: "flex",
          gap: "25px",
          padding: "25px",
        }}
      >
        <PrimaryButton loading={false} className="action-button">action</PrimaryButton>
        <PrimaryButton loading={false} className="main-button">main</PrimaryButton>
        <PrimaryButton loading={false} className="control-button">control</PrimaryButton>
        <PrimaryButton loading={false} className="secondary-button">secondary</PrimaryButton>
      </div>

      <div
        style={{
          // backgroundColor: "#e5e5e5",
          display: "flex",
          gap: "25px",
          padding: "25px",
        }}
      >
        <PrimaryButton loading={true} className="action-button">action</PrimaryButton>
        <PrimaryButton loading={true} className="main-button">main</PrimaryButton>
        <PrimaryButton loading={true} className="control-button">control</PrimaryButton>
        <PrimaryButton loading={true} className="secondary-button">secondary</PrimaryButton>
      </div>
    </>
  );
}
