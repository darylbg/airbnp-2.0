import React, { useRef, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AddressSearch from "../../AddressSearch/AddressSearch";
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
    </>
  );
}
