import React, { useState } from "react";
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
  // console.log(currentUser.user_image)
  const [loading, setLoading] = useState(false);
  const [personalInfoEditSaving, setPersonalInfoEditSaving] = useState(false);
  const [editable, setEditable] = useState(false);

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

    clearErrors("firstName");
    clearErrors("lastName");
    clearErrors("displayName");
    clearErrors("email");
  };

  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);

  const handlePersonalInfoEdit = async (FormData) => {
    setLoading(true);
    setPersonalInfoEditSaving(true);

    setTimeout(async () => {
      try {
        setEditable(false);
        console.log(FormData);
        const updatedUser = await updateUserMutation({
          variables: {
            userData: {
              first_name: FormData.firstName,
              last_name: FormData.lastName,
              display_name: FormData.displayName,
              email: FormData.email,
              gender: currentUser.gender,
              user_image: currentUser.image,
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

        // clear errors
        clearErrors("firstName");
        clearErrors("lastName");
        clearErrors("displayName");
        clearErrors("email");

        toast.success(<ToastComponent message="Successfully updated." />);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setPersonalInfoEditSaving(false);
      }
    }, 10000);
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
              className="default-button edit-button"
            >
              Edit
            </PrimaryButton>
          ) : (
            <PrimaryButton className="default-button " action={cancelPersonalInfoEdit} loading={loading}>
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
                disabled={!editable}
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
                disabled={!editable}
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
                <PrimaryButton loading={loading} className="default-button save-button">
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
