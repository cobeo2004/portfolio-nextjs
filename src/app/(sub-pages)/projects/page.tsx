"use client";
import Image from "next/image";
import background from "../../../../public/assets/background/projects-background.png";
import ProjectList from "../../../components/ProjectList";
import { getProjectsData } from "../../../lib/data";
import RenderModel from "../../../components/models/RenderModel";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TProjectList } from "@/types";
import { motion } from "framer-motion";

const StaffModel = dynamic(
  () =>
    import("../../../components/models/staff.model").then(
      (mod) => mod.StaffModel
    ),
  {
    ssr: false,
  }
);
export default function Home() {
  const [projectsData, setProjectsData] = useState<TProjectList[]>([]);

  useEffect(() => {
    const fetchProjectsData = async () => {
      const data = await getProjectsData();
      setProjectsData(data);
    };
    fetchProjectsData();
  }, []);
  return (
    <>
      <Image
        src={background}
        priority
        sizes="100vw"
        alt="background-image"
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center opacity-25"
      />
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 flex flex-col items-center justify-center pt-20 lg:pt-0"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent tracking-wider drop-shadow-[0_2px_10px_rgba(254,254,91,0.3)]">
          Projects
        </h1>
        <p className="text-muted text-sm md:text-base mt-2 opacity-80 italic">
          (updated from Github)
        </p>
      </motion.header>
      <div className="z-10 cursor-pointer pt-12 pb-20">
        <ProjectList projects={projectsData} />
      </div>
      <div className="flex items-center justify-center fixed top-0 left-0 w-full h-screen z-0 pointer-events-none opacity-40 lg:opacity-100">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-[-20%] w-full h-full max-w-[800px] aspect-square">
          <RenderModel>
            <StaffModel />
          </RenderModel>
        </div>
      </div>
    </>
  );
}
