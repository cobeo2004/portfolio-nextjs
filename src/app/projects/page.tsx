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
