"use client";
import Image from "next/image";
import background from "../../public/assets/background/home-background.png";
import RenderModel from "./components/models/RenderModel";
import { WizardModel } from "./components/models/wizard.model";
import Navigation from "./components/navigation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <div className="absolute inset-0 z-0">
        <Image
          src={background}
          alt="Background-image"
          fill
          className="w-full h-full object-cover object-center opacity-25"
        />
      </div>
      <div className="w-full h-screen z-10">
        <Navigation />
        <RenderModel>
          <WizardModel />
        </RenderModel>
      </div>
    </main>
  );
}
