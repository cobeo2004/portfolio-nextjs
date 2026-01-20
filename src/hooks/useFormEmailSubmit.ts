import emailjs from "@emailjs/browser";
import { TFormValue, TTemplateParams } from "@/types";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { env } from "@/lib/env";
export const useFormEmailSubmit = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>() => {
  const res = useForm<TFieldValues>();
  const onSubmit = (data: TFieldValues) => {
    const templateParams: TTemplateParams = {
      to_name: "Simon Nguyen",
      from_name: data.name as string,
      reply_to: data.email as string,
      message: data.message as string,
    };
    sendEmail(templateParams);
  };
  const sendEmail = async (params: TTemplateParams) => {
    const toastId = toast.loading("Sending your cast, please wait...");
    await emailjs
      .send(
        env.NEXT_PUBLIC_SERVICE_ID as string,
        env.NEXT_PUBLIC_TEMPLATE_ID as string,
        params,
        {
          publicKey: env.NEXT_PUBLIC_KEY as string,
          limitRate: {
            throttle: 30000,
          },
        },
      )
      .then(() =>
        toast.success(
          "Your cast has been sent, you will be enlighted by the wizard soon!",
          { id: toastId },
        ),
      )
      .catch((err: any) =>
        toast.error(
          "Oopsie, your message could not be able to send due to this obstacle: " +
            err,
          { id: toastId },
        ),
      );
  };

  return { res, onSubmit };
};
