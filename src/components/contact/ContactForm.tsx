"use client";

import type React from "react";
import { useFormEmailSubmit } from "@/hooks/useFormEmailSubmit";

type TFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: (describedBy?: string) => React.ReactNode;
};

const Field = ({ id, label, error, children }: TFieldProps) => (
  <div className="field" data-invalid={error ? "" : undefined}>
    <label htmlFor={id}>{label}</label>
    {children(error ? `${id}E` : undefined)}
    {error && (
      <span className="err" id={`${id}E`}>
        {error}
      </span>
    )}
  </div>
);

// Sends through EmailJS (see useFormEmailSubmit); validation messages say how to fix the field.
export default function ContactForm() {
  const { res, onSubmit, status } = useFormEmailSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = res;

  return (
    <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <h3 className="display">Get in touch</h3>
      <Field id="fName" label="Name" error={errors.name?.message}>
        {(describedBy) => (
          <input
            className="input"
            id="fName"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy}
            {...register("name", {
              validate: (v) => v.trim().length >= 2 || "Add your name.",
            })}
          />
        )}
      </Field>
      <Field id="fEmail" label="Email" error={errors.email?.message}>
        {(describedBy) => (
          <input
            className="input"
            id="fEmail"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy}
            {...register("email", {
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Enter an email I can reply to, like you@company.com.",
              },
              required: "Enter an email I can reply to, like you@company.com.",
            })}
          />
        )}
      </Field>
      <Field id="fMsg" label="Message" error={errors.message?.message}>
        {(describedBy) => (
          <textarea
            className="input"
            id="fMsg"
            placeholder="What are you working on?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy}
            {...register("message", {
              validate: (v) =>
                v.trim().length >= 20 ||
                "Add a little more detail, at least 20 characters.",
            })}
          />
        )}
      </Field>
      <div className="flex flex-wrap items-center gap-3.5">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        <span className="fstat" aria-live="polite">
          {status === "sent" && "Thanks. I reply within two working days."}
          {status === "error" &&
            "That did not send. Email me directly instead."}
        </span>
      </div>
    </form>
  );
}
