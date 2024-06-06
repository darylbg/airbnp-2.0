import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import toast from "react-hot-toast";

import "./PersonalInfo.css";
import { useSelector } from "react-redux";
import PrimaryButton from "../../PrimitiveComponents/PrimaryButton/PrimaryButton";

export default function PersonalInfo() {
  const currentUser = useSelector((state) => state.userDetails.byId);

  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: currentUser.first_name,
      lastName: currentUser.last_name,
      displayName: currentUser.display_name,
      email: currentUser.email,
      password: currentUser.password
    },
  });

  const handleEditEnable = () => {
    setEditable(true);
  };

  const cancelPersonalInfoEdit = () => {
    setEditable(false);
  };

  const handlePersonalInfoEdit = async (FormData) => {
    setLoading(true);
    setEditable(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setEditable(false);
      console.log(FormData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.success(<ToastComponent message="Successfully updated personal info."/>);
    }
  };

  return (
    <section className="personal-info">
      <div className="edit-enable">
        {!editable ? (
          <PrimaryButton action={handleEditEnable} loading={loading}>
            Edit
          </PrimaryButton>
        ) : (
          <PrimaryButton action={cancelPersonalInfoEdit} loading={loading}>
            Cancel
          </PrimaryButton>
        )}
      </div>
      <Form.Root
        onSubmit={handleSubmit(handlePersonalInfoEdit)}
        className="edit-personal-info-form"
      >
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">First Name</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...register("firstName", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.firstName?.message}</div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">Last Name</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...register("lastName", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.lastName?.message}</div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">Display Name</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...register("displayName", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.displayName?.message}</div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">Email</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...register("email", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.email?.message}</div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">Password</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...register("password", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">{errors.password?.message}</div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Submit asChild>
            {editable && (
              <PrimaryButton loading={loading}>
                {" "}
                update user details
              </PrimaryButton>
            )}
          </Form.Submit>
        </Form.Field>
      </Form.Root>
    </section>
  );
}
