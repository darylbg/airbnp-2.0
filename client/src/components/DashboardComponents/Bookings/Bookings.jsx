import React from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AddressSearch from "../../AddressSearch/AddressSearch";

export default function Bookings() {
  return (
    <>
      <DashboardHeader
        title="Bookings"
        subtitle="Manage your bookings"
        icon="today"
      ></DashboardHeader>
    <AddressSearch />
    </>
  );
}
