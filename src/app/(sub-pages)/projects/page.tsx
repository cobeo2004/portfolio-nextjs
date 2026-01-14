"use client";
import Image from "next/image";
import background from "../../../../public/assets/background/projects-background.png";
import ProjectList from "../../../components/ProjectList";
import RenderModel from "../../../components/models/RenderModel";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useGetProjects } from "@/hooks/useGetProjects";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

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
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    refetch,
  } = useGetProjects();

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

      <div className="z-10 cursor-pointer pt-12 pb-20 min-h-[400px] flex flex-col items-center justify-center">
        {projectsLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 text-accent"
          >
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-lg font-medium animate-pulse">
              Summoning projects...
            </p>
          </motion.div>
        ) : projectsError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                The magic failed!
              </h2>
              <p className="text-muted text-sm">
                We couldn&apos;t fetch your repositories. Please check your
                connection or try again later.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-accent text-background font-semibold hover:scale-105 transition-transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        ) : (
          <ProjectList projects={projectsData ?? []} />
        )}
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
