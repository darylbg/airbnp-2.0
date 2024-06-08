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
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    setValue: setValuePersonalInfo,
    clearErrors: clearErrorsPersonalInfo,
    formState: { errors: errorsPersonalInfo },
  } = useForm({
    defaultValues: {
      firstName: currentUser.first_name,
      lastName: currentUser.last_name,
      displayName: currentUser.display_name,
      email: currentUser.email,
    },
  });

  const handleEditEnable = () => {
    setEditable(true);
  };

  const cancelPersonalInfoEdit = () => {
    setEditable(false);
    setValuePersonalInfo("firstName", currentUser.first_name);
    setValuePersonalInfo("lastName", currentUser.last_name);
    setValuePersonalInfo("displayName", currentUser.display_name);
    setValuePersonalInfo("email", currentUser.email);

    clearErrorsPersonalInfo("firstName");
    clearErrorsPersonalInfo("lastName");
    clearErrorsPersonalInfo("displayName");
    clearErrorsPersonalInfo("email");
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
      toast.success(
        <ToastComponent message="Successfully updated personal info." />
      );
    }
  };

  return (
    <section className="personal-info">
      <div className="edit-enable">
        <h3>Update personal info</h3>
        {!editable ? (
          <PrimaryButton
            action={handleEditEnable}
            loading={loading}
            className="edit-button"
          >
            Edit
          </PrimaryButton>
        ) : (
          <PrimaryButton action={cancelPersonalInfoEdit} loading={loading}>
            Cancel
          </PrimaryButton>
        )}
      </div>
      <Form.Root
        onSubmit={handleSubmitPersonalInfo(handlePersonalInfoEdit)}
        className="edit-personal-info-form"
      >
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">First Name</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...registerPersonalInfo("firstName", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">
            {errorsPersonalInfo.firstName?.message}
          </div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">Last Name</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...registerPersonalInfo("lastName", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">
            {errorsPersonalInfo.lastName?.message}
          </div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">Display Name</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...registerPersonalInfo("displayName", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">
            {errorsPersonalInfo.displayName?.message}
          </div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Label className="field-label">Email</Form.Label>
          <Form.Control asChild>
            <input
              disabled={!editable}
              type="text"
              {...registerPersonalInfo("email", {
                required: "This is required",
              })}
            />
          </Form.Control>
          <div className="field-message">
            {errorsPersonalInfo.email?.message}
          </div>
        </Form.Field>
        <Form.Field className="edit-personal-info-field">
          <Form.Submit asChild>
            {editable && (
              <PrimaryButton loading={loading} className="save-button">
                {" "}
                Save
              </PrimaryButton>
            )}
          </Form.Submit>
        </Form.Field>
      </Form.Root>
    </section>
  );
}
