"use client";
import React from "react";
import { Toaster } from "sonner";
import { useFormEmailSubmit } from "../hooks/useFormEmailSubmit";
import { TFormValue } from "@/app/types";
export default function ContactForm() {
  const { res, onSubmit } = useFormEmailSubmit<TFormValue>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = res;

  return (
    <>
      <Toaster richColors={true} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg w-full flex flex-col items-center justify-center space-y-4"
      >
        <input
          type="text"
          placeholder="Name"
          className="w-[600px] p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 custom-background"
          {...register("name", {
            required: "This field is required!",
            minLength: {
              value: 3,
              message: "Name should contains 3 characters long!",
            },
          })}
        />
        {errors.name && (
          <span className="inline-block self-start text-accent">
            {errors.name.message}
          </span>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-[600px] p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 custom-background"
          {...register("email", { required: "This field is required!" })}
        />
        {errors.email && (
          <span className="inline-block self-start text-accent">
            {errors.email.message}
          </span>
        )}
        <textarea
          placeholder="Message"
          {...register("message", {
            required: "This field is required!",
            maxLength: {
              value: 256,
              message: "Message could not be longer than 256 words!",
            },
            minLength: {
              value: 50,
              message: "Message could not be shorter than 50 words!",
            },
          })}
          className="w-[600px] p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 custom-background"
        />
        {errors.message && (
          <span className="inline-block self-start text-accent">
            {errors.message.message}
          </span>
        )}
        <input
          type="submit"
          value="Cast your spell !"
          className="px-10 py-4 rounded-md shadow-lg bg-background border border-accent/30 border-solid hover:shadow-glass-sm backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer capitalize "
        />
      </form>
    </>
  );
}
