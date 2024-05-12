import React from 'react';
import { useDispatch } from "react-redux";
import { ApolloError, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import toast from "react-hot-toast";
import ToastComponent from "../PrimitiveComponents/ToastComponent/ToastComponent";
import { SIGN_IN_MUTATION } from "../../utils/mutations";
import "./NewListing.css";

export default function NewListing() {

  const handleNewListing = () => {
    console.log("added new listing");
  }

  return (
    <div className='new-listing-container'>
      new listing
    </div>
  )
}
