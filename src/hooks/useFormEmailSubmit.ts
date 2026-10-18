import emailjs from "@emailjs/browser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { env } from "@/lib/env";
import { TFormValue, TTemplateParams } from "@/types";

type TSubmitStatus = "idle" | "sending" | "sent" | "error";

export const useFormEmailSubmit = () => {
  const res = useForm<TFormValue>({ mode: "onTouched" });
  const [status, setStatus] = useState<TSubmitStatus>("idle");

  const sendEmail = async (params: TTemplateParams) => {
    setStatus("sending");
    const toastId = toast.loading("Sending your message...");
    try {
      await emailjs.send(
        env.NEXT_PUBLIC_SERVICE_ID as string,
        env.NEXT_PUBLIC_TEMPLATE_ID as string,
        params,
        {
          publicKey: env.NEXT_PUBLIC_KEY as string,
          limitRate: {
            throttle: 30000,
          },
        },
      );
      toast.success("Message sent. I reply within two working days.", {
        id: toastId,
      });
      setStatus("sent");
      res.reset();
    } catch (err: unknown) {
      const reason =
        err && typeof err === "object" && "text" in err
          ? String((err as { text: unknown }).text)
          : "please try again, or email me directly";
      toast.error(`Your message did not send: ${reason}.`, { id: toastId });
      setStatus("error");
    }
  };

  const onSubmit = (data: TFormValue) =>
    sendEmail({
      to_name: "Simon Nguyen",
      from_name: data.name,
      reply_to: data.email,
      message: data.message,
    });

  return { res, onSubmit, status };
};
