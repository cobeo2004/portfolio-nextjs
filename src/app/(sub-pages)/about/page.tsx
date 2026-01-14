"use client";
import Image from "next/image";
import background from "../../../../public/assets/background/about-background.png";
import RenderModel from "../../../components/models/RenderModel";
import AboutDetails from "@/components/About";
import dynamic from "next/dynamic";

const HatModel = dynamic(
  () =>
    import("../../../components/models/hat.model").then((mod) => mod.HatModel),
  {
    ssr: false,
  }
);
export default function About() {
  return (
    <>
      <header>
        <title>About</title>
      </header>
      <Image
        src={background}
        priority
        sizes="100vw"
        alt="background-image"
        className="z-0 fixed top-0 left-0 w-full h-full object-cover object-center opacity-25"
      />
      <div className="w-full h-[60vh] xs:h-[75vh] sm:h-screen absolute top-12 -translate-y-1/2 left-0 ">
        <RenderModel>
          <HatModel />
        </RenderModel>
      </div>
      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        <div className="absolute flex flex-col items-center text-center top-[75%] sm:top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="font-bold text-6xl xs:text-7xl sm:text-8xl text-accent">
            SimonNguyen
          </h1>
          <p className="font-light text-md font-background text-ls mt-2">
            The real wizard whom created this portfolio
          </p>
        </div>
      </div>
      <AboutDetails />
    </>
  );
}
