import type { Metadata } from "next";
import ContactBand from "@/components/contact/ContactBand";
import PageMotion from "@/components/motion/PageMotion";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email Simon Nguyen, send a message, or ask his CV.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <ContactBand page />
      <PageMotion />
    </main>
  );
}
