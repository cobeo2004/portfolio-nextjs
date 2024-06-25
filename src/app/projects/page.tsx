"use client";
import Image from "next/image";
import background from "../../../public/assets/background/projects-background.png";
import ProjectList from "../components/ProjectList";
import { projectsData } from "../data";
import RenderModel from "../components/models/RenderModel";
import { StaffModel } from "../components/models/staff.model";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      {/* <div className="absolute z-0 inset-0">
        <Image
          src={background}
          alt="Background-image"
          fill
          className="w-full h-full object-cover object-center opacity-25"
        />
      </div>
      <div className="z-20">
        <ProjectList projects={projectsData} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-0 m-0">
        <div className="absolute top-1/4 left-0 h-screen">
          <RenderModel>
            <StaffModel />
          </RenderModel>
        </div>
      </div> */}
      <Image
        src={background}
        alt="background-image"
        fill
        className="z-0 w-full h-full object-cover object-center opacity-25"
      />
      <div className="z-10 cursor-pointer">
        <ProjectList projects={projectsData} />
      </div>
      <div className="flex items-center justify-center fixed top-20 left-0 h-screen">
        <RenderModel>
          <StaffModel />
        </RenderModel>
      </div>
    </main>
  );
}
