import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import ToastComponent from "../../PrimitiveComponents/ToastComponent/ToastComponent";
import toast from "react-hot-toast";
import { ApolloError, useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../../../utils/mutations/userMutations";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../../../reducers/userDetailsReducer";
import PrimaryButton from "../../PrimitiveComponents/ButtonComponent/ButtonComponent";
import Spinner from "../../PrimitiveComponents/Spinner/Spinner";
import "./PersonalInfo.css";

export default function PersonalInfo() {
  const currentUser = useSelector((state) => state.userDetails.byId);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [personalInfoEditSaving, setPersonalInfoEditSaving] = useState(false);
  const [editable, setEditable] = useState(false);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null); // Track base64 image string

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors: errorsPersonalInfo },
  } = useForm({
    defaultValues: {
      firstName: currentUser.first_name,
      lastName: currentUser.last_name,
      displayName: currentUser.display_name,
      email: currentUser.email,
      userImage: currentUser.user_image,
    },
  });

  const handleEditEnable = () => {
    setEditable(true);
  };

  const cancelPersonalInfoEdit = () => {
    setEditable(false);
    setValue("firstName", currentUser.first_name);
    setValue("lastName", currentUser.last_name);
    setValue("displayName", currentUser.display_name);
    setValue("email", currentUser.email);
    setValue("userImage", currentUser.user_image);

    clearErrors("firstName");
    clearErrors("lastName");
    clearErrors("displayName");
    clearErrors("email");
    clearErrors("userImage");

    setUserImagePreview(currentUser.user_image); // Reset image preview
    setBase64Image(null); // Clear base64 image
  };

  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);

  const handlePersonalInfoEdit = async (formData) => {
    setLoading(true);
    setPersonalInfoEditSaving(true);

    try {
      // Send the base64 image string (or keep the existing image if no new one is selected)
      const updatedUser = await updateUserMutation({
        variables: {
          userData: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            display_name: formData.displayName,
            email: formData.email,
            gender: currentUser.gender,
            user_image: base64Image || currentUser.user_image, // Send the base64 image string
          },
        },
      });

      // Dispatch the action to update user details in Redux
      await dispatch(
        updateUserDetails({
          userId: currentUser.id,
          updates: updatedUser.data.updateUser,
        })
      );

      // Set form values after Redux update
      setValue("firstName", updatedUser.data.updateUser.first_name);
      setValue("lastName", updatedUser.data.updateUser.last_name);
      setValue("displayName", updatedUser.data.updateUser.display_name);
      setValue("email", updatedUser.data.updateUser.email);
      setValue("userImage", updatedUser.data.updateUser.user_image);

      // Clear errors
      clearErrors("firstName");
      clearErrors("lastName");
      clearErrors("displayName");
      clearErrors("email");
      clearErrors("userImage");

      setEditable(false);
      setLoading(false);
      toast.success(<ToastComponent message="Successfully updated." />);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPersonalInfoEditSaving(false);
    }
  };

  const selectNewUserImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setBase64Image(base64String); // Set base64 string to state
        setUserImagePreview(base64String); // Update preview
      };
      reader.readAsDataURL(file); // Convert image file to base64 string
    }
  };

  useEffect(() => {
    setUserImagePreview(currentUser.user_image);
  }, [currentUser.user_image]);

  return (
    <section className="personal-info">
      <div className="edit-personal-info">
        <div className="edit-enable">
          <h3>Update personal info</h3>
          {!editable ? (
            <PrimaryButton
              action={handleEditEnable}
              loading={loading}
              className="default-button secondary-button"
            >
              Edit
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className="default-button secondary-button"
              action={cancelPersonalInfoEdit}
              loading={loading}
            >
              Cancel
            </PrimaryButton>
          )}
        </div>
        <Form.Root
          onSubmit={handleSubmit(handlePersonalInfoEdit)}
          className="edit-personal-info-form"
        >
          <Form.Field>              <Form.Label className="field-label">Profile image</Form.Label>

            <div className="user-image-preview">
              {userImagePreview ? (
                <img src={userImagePreview} alt="User Preview" />
              ) : (
                <span>No Image</span>
              )}
              <Form.Control asChild>
                <input
                  disabled={!editable || loading}
                  name="userImage"
                  id="userImage"
                  type="file"
                  accept="image/*"
                  {...register("userImage")}
                  onChange={selectNewUserImage}
                  style={{ display: "none" }}
                />
              </Form.Control>
              {editable && !loading && (
                <label htmlFor="userImage" className="custom-file-upload">
                  <span class="material-symbols-outlined">edit</span>
                </label>
              )}
            </div>
          </Form.Field>
          <Form.Field className="edit-personal-info-field">
            <Form.Label className="field-label">First Name</Form.Label>
            <Form.Control asChild>
              <input
                className="input-underline"
                disabled={!editable || loading}
                type="text"
                {...register("firstName", {
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
                className="input-underline"
                disabled={!editable || loading}
                type="text"
                {...register("lastName", {
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
                className="input-underline"
                disabled={!editable || loading}
                type="text"
                {...register("displayName", {
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
                className="input-underline"
                disabled={!editable || loading}
                type="text"
                {...register("email", {
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
                <PrimaryButton
                  loading={loading}
                  className="default-button primary-button"
                >
                  Save
                  {personalInfoEditSaving ? <Spinner /> : null}
                </PrimaryButton>
              )}
            </Form.Submit>
          </Form.Field>
        </Form.Root>
      </div>
    </section>
  );
}
