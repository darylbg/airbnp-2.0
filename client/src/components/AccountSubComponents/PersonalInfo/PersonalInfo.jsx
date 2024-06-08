import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import toast from "react-hot-toast";
import { ApolloError, useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../../../utils/mutations/userMutations";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../../../reducers/userDetailsReducer";
import PrimaryButton from "../../PrimitiveComponents/PrimaryButton/PrimaryButton";
import PasswordVisibilityToggle from "../../PrimitiveComponents/PasswordVisibilityToggle/PasswordVisibilityToggle";
import "./PersonalInfo.css";

export default function PersonalInfo() {
  const currentUser = useSelector((state) => state.userDetails.byId);
  const dispatch = useDispatch();
  // console.log(currentUser.user_image)
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);
  const [passwordEditable, setPasswordEditable] = useState(false);

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

  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);

  const handlePersonalInfoEdit = async (FormData) => {
    setLoading(true);
    try {
      setEditable(false);
      console.log(FormData);
      const updatedUser = await updateUserMutation({
        variables: {
          userData: {
            // ...currentUser,
            first_name: FormData.firstName,
            last_name: FormData.lastName,
            display_name: FormData.displayName,
            email: FormData.email,
            gender: currentUser.gender,
            user_image: currentUser.image,           
          },
        },
      });

      dispatch(updateUserDetails({userId: currentUser.id, updates: updatedUser.data.updateUser}));
      console.log(updatedUser.data.updateUser);
      toast.success(
        <ToastComponent message="Successfully updated personal info." />
      );

      setValuePersonalInfo("firstName", currentUser.first_name);
      setValuePersonalInfo("lastName", currentUser.last_name);
      setValuePersonalInfo("displayName", currentUser.display_name);
      setValuePersonalInfo("email", currentUser.email);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);

      setValuePersonalInfo("firstName", currentUser.first_name);
      setValuePersonalInfo("lastName", currentUser.last_name);
      setValuePersonalInfo("displayName", currentUser.display_name);
      setValuePersonalInfo("email", currentUser.email);
    }
  };

  // change password logic
  const hiddenPasswordPlaceholder = "******";

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    setValue: passwordSetValue,
    clearErrors: passwordClearErrors,
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
    passwordSetValue("currentPassword", "");
    passwordSetValue("newPassword", "");
    passwordSetValue("newPasswordConfirm", "");

    passwordClearErrors("currentPassword");
    passwordClearErrors("newPassword");
    passwordClearErrors("newPasswordConfirm");

    setPasswordEditable(false);
  };

  const handlePasswordChange = async (FormData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      passwordSetValue("currentPassword", "");
      passwordSetValue("newPassword", "");
      passwordSetValue("newPasswordConfirm", "");

      passwordClearErrors("currentPassword");
      passwordClearErrors("newPassword");
      passwordClearErrors("newPasswordConfirm");

      setPasswordEditable(false);
      console.log("changed password", FormData);
      toast.success(
        <ToastComponent message="Successfully changed password." />
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    console.log("successfully changed password", FormData);
  };

  return (
    <section className="personal-info">
      <div className="edit-personal-info">
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
      </div>

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
          onSubmit={passwordHandleSubmit(handlePasswordChange)}
        >
          <Form.Field className="edit-personal-info-field">
            <Form.Label className="field-label">Current password</Form.Label>
            <Form.Control className="change-password-field" asChild>
              <input
                placeholder={hiddenPasswordPlaceholder}
                disabled={!passwordEditable}
                type="password"
                {...passwordRegister("currentPassword", {
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
                      {...passwordRegister("newPassword", {
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
                      {...passwordRegister("newPasswordConfirm", {
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
