"use client";
import Image from "next/image";
import background from "../../public/assets/background/home-background.png";
import RenderModel from "../components/models/RenderModel";
import Navigation from "../components/navigation";
import dynamic from "next/dynamic";

const WizardModel = dynamic(
  () =>
    import("@/components/models/wizard.model").then((mod) => mod.WizardModel),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <>
      <header>
        <title>Home</title>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between relative">
        <div className="absolute inset-0 z-0">
          <Image
            src={background}
            priority
            sizes="100vw"
            alt="Background-image"
            fill
            className="w-full h-full object-cover object-center opacity-25"
          />
        </div>
        <div className="w-full h-screen z-20">
          <Navigation />
          <RenderModel className="z-0">
            <WizardModel />
          </RenderModel>
        </div>
      </main>
    </>
  );
}
