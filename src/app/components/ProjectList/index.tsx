"use client";
import { TProjectList } from "@/app/types";
import React from "react";
import ProjectLayout from "./project.layout";
import { motion, Variants } from "framer-motion";
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 1.5,
    },
  },
};

const ProjectList = ({ projects }: { projects: TProjectList[] }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-auto xl:max-w-4xl px-4 mx-auto lg:px-16 space-y-6 md:space-y-8 flex-col items-center"
    >
      {projects.map((project, index) => (
        <ProjectLayout {...project} key={index}></ProjectLayout>
      ))}
    </motion.div>
  );
};

export default ProjectList;
