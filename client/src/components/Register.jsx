import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        gender: ""
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    
  };
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>first name</label>
      <input
        type="text"
        {...register("firstName", { required: "This is required" })}
        placeholder="First name"
      />
      <p>{errors.firstName?.message}</p>
      <label>last name</label>
      <input
        type="text"
        {...register("lastName", {
          required: "this is required",
          minLength: {
            value: 5,
            message: "must be 5 or more charachters",
          },
        })}
        placeholder="Last name"
      />
      <p>{errors.lastName?.message}</p>
      <label>email</label>
      <input type="text" {...register("email")} placeholder="Email" />
      <label>gender</label>
      <input type="text" {...register("gender")} placeholder="Gender" />
      <input type="submit" />
    </form>
  );
}
