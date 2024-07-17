import React, { useRef, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AddressSearch from "../../AddressSearch/AddressSearch";
import PrimaryButton from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
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
          backgroundColor: "white",
          display: "flex",
          gap: "25px",
          padding: "25px",
        }}
      >
        <PrimaryButton loading={false} className="default-button action-button">action</PrimaryButton>
        <PrimaryButton loading={false} className="default-button main-button">main</PrimaryButton>
        <PrimaryButton loading={false} className="default-button secondary-button">secondary</PrimaryButton>
        <PrimaryButton loading={false} className="default-button control-button">control</PrimaryButton>
        <PrimaryButton loading={false} className="default-button delete-button">delete</PrimaryButton>
      </div>

      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          gap: "25px",
          padding: "25px",
        }}
      >
        <PrimaryButton loading={true} className="default-button action-button">action</PrimaryButton>
        <PrimaryButton loading={true} className="default-button main-button">main</PrimaryButton>
        <PrimaryButton loading={true} className="default-button secondary-button">secondary</PrimaryButton>
        <PrimaryButton loading={true} className="default-button control-button">control</PrimaryButton>
        <PrimaryButton loading={true} className="default-button delete-button">delete</PrimaryButton>
      </div>
    </>
  );
}
