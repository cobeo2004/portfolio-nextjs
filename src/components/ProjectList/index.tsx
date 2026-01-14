"use client";
import { TProjectList } from "@/types";
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
      className="w-full max-w-auto xl:max-w-6xl px-4 mx-auto lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center"
    >
      {projects.map((project, index) => (
        <ProjectLayout {...project} key={index}></ProjectLayout>
      ))}
    </motion.div>
  );
};

export default ProjectList;
