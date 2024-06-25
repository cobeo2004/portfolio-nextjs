"use client";
import Image from "next/image";
import background from "../../../../public/assets/background/contact-background.png";
import ContactForm from "@/app/components/contact/contact.form";

export default function Contact() {
  return (
    <>
      <Image
        src={background}
        alt="background-image"
        className="z-0 fixed top-0 left-0 w-full h-full object-cover object-center opacity-25"
      />
      <div className="">
        <article className="relative w-full flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <h1 className="text-accent font-semibold text-center text-4xl capitalize">
              Call-up the Wizard
            </h1>
            <p className="text-center font-light">
              Enter the realm of wonder and infuse your words with the essence
              of the universe. Whether you aim to spark collaborations, unveil
              secrets, or simply narrate epic adventures, your messages become
              cherished manuscripts in this domain. Use the form below to send
              your communications through the mystical network and await the
              magical reply.
            </p>
          </div>
          <div className="z-20">
            <ContactForm />
          </div>
        </article>
      </div>
    </>
  );
}
