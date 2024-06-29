import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../PrimitiveComponents/PrimaryButton/PrimaryButton";
import PasswordVisibilityToggle from "../../PrimitiveComponents/PasswordVisibilityToggle/PasswordVisibilityToggle";
import Spinner from "../../PrimitiveComponents/Spinner/Spinner";
import "../PersonalInfo/PersonalInfo.css";

export default function LoginAndSecurity() {
  const currentUser = useSelector((state) => state.userDetails.byId);
  const dispatch = useDispatch();
  // console.log(currentUser.user_image)
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordEditable, setPasswordEditable] = useState(false);
  
  // change password logic
  const hiddenPasswordPlaceholder = "******";

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors: errorsPassword },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const handlePasswordEditEnable = () => {
    setPasswordEditable(true);
  };

  const cancelPasswordEdit = () => {
    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("newPasswordConfirm", "");

    clearErrors("currentPassword");
    clearErrors("newPassword");
    clearErrors("newPasswordConfirm");

    setPasswordEditable(false);
  };

  const handlePasswordChange = async (FormData) => {
    setLoading(true);
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("newPasswordConfirm", "");

      clearErrors("currentPassword");
      clearErrors("newPassword");
      clearErrors("newPasswordConfirm");

      setPasswordEditable(false);
      console.log("changed password", FormData);
      toast.success(
        <ToastComponent message="Successfully changed password." />
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSaving(false);
    }
    console.log("successfully changed password", FormData);
  };

  return (
    <section className="personal-info">
      {/* change password form */}
      <div className="change-password">
        <div className="change-password-enable">
          <h3>Set a new password</h3>
          {!passwordEditable ? (
            <PrimaryButton
              action={handlePasswordEditEnable}
              loading={loading}
              className="edit-button"
            >
              Change
            </PrimaryButton>
          ) : (
            <PrimaryButton action={cancelPasswordEdit} loading={loading}>
              Cancel
            </PrimaryButton>
          )}
        </div>
        <Form.Root
          className="change-password-form"
          onSubmit={handleSubmit(handlePasswordChange)}
        >
          <Form.Field className="edit-personal-info-field">
            <Form.Label className="field-label">{passwordEditable ? "Enter your current password" : "Current password"}</Form.Label>
            <Form.Control className="change-password-field" asChild>
              <input
                placeholder={hiddenPasswordPlaceholder}
                disabled={!passwordEditable}
                type="password"
                {...register("currentPassword", {
                  required: "This is required",
                })}
              />
            </Form.Control>
            <div className="field-message">
              {errorsPassword.currentPassword?.message}
            </div>
          </Form.Field>
          {passwordEditable && (
            <>
              <Form.Field className="edit-personal-info-field">
                <Form.Label className="field-label">New password</Form.Label>
                <div className="password-visibility-wrapper">
                  <Form.Control asChild>
                    <input
                      type="password"
                      {...register("newPassword", {
                        required: "This is required",
                      })}
                    />
                  </Form.Control>
                  <PasswordVisibilityToggle action={(e) => {}} />
                </div>
                <div className="field-message">
                  {errorsPassword.newPassword?.message}
                </div>
              </Form.Field>
              <Form.Field className="edit-personal-info-field">
                <Form.Label className="field-label">
                  Retype new password
                </Form.Label>
                <div className="password-visibility-wrapper">
                  <Form.Control asChild>
                    <input
                      type="password"
                      {...register("newPasswordConfirm", {
                        required: "This is required",
                      })}
                    />
                  </Form.Control>
                  <PasswordVisibilityToggle action={(e) => {}} />
                </div>
                <div className="field-message">
                  {errorsPassword.newPasswordConfirm?.message}
                </div>
              </Form.Field>
              <Form.Field className="edit-personal-info-field">
                <Form.Submit asChild>
                  <PrimaryButton className="save-button" loading={loading}>
                    Save
                    {saving? <Spinner /> : null}
                  </PrimaryButton>
                </Form.Submit>
              </Form.Field>
            </>
          )}
        </Form.Root>
      </div>
    </section>
  );
}
