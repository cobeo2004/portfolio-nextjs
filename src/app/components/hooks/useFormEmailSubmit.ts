import emailjs from '@emailjs/browser';
import { TFormValue, TTemplateParams } from "@/app/types"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "sonner";

export const useFormEmailSubmit = <TFieldValues extends FieldValues = FieldValues, TEmailParam extends TTemplateParams = TTemplateParams, TContext = any, TTransformedValues extends FieldValues | undefined = undefined>() => {
    const res = useForm<TFormValue>();
    const onSubmit = (data: TFormValue) => {
        const templateParams: TTemplateParams = {
            to_name: "Simon Nguyen",
            from_name: data.name,
            reply_to: data.email,
            message: data.message
        }
        sendEmail(templateParams);
    }
    const sendEmail = async (params: TTemplateParams) => {
        const toastId = toast.loading("Sending your cast, please wait...");
        const res = emailjs
            .send(
                process.env.NEXT_PUBLIC_SERVICE_ID as string,
                process.env.NEXT_PUBLIC_TEMPLATE_ID as string,
                params,
                {
                    publicKey: process.env.NEXT_PUBLIC_KEY as string,
                    limitRate: {
                        throttle: 30000,
                    },
                }
            )
            .then(() =>
                toast.success(
                    "Your cast has been sent, you will be enlighted by the wizard soon!",
                    { id: toastId }
                )
            )
            .catch((err: any) =>
                toast.error(
                    "Oopsie, your message could not be able to send due to this obstacle: " +
                    err,
                    { id: toastId }
                )
            );
    };

    return { res, onSubmit }
}
