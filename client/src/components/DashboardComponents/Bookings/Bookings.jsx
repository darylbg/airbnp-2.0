import React, { useRef, useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AddressSearch from "../../AddressSearch/AddressSearch";
import "./Bookings.css";
import DialogComponent from "../../PrimitiveComponents/DialogComponent/DialogComponent";

export default function Bookings() {
  const [dialog, setDialog] = useState(true);
  const dialogRef = useRef(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  }

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <DashboardHeader
        title="Bookings"
        subtitle="Manage your bookings"
        icon="today"
      ></DashboardHeader>

      <button onClick={openDialog}>open</button>
      <dialog ref={dialogRef} className="test-dialog">
        <button onClick={closeDialog}>close</button>
        hello world
        <AddressSearch />
      </dialog>
      <div className="ontop">on top</div>
    </>
  );
}
