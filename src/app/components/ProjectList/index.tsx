import { TProjectList } from "@/app/types";
import React from "react";
import ProjectLayout from "./project.layout";

const ProjectList = ({ projects }: { projects: TProjectList[] }) => {
  return (
    <div className="w-full max-w-auto xl:max-w-4xl px-4 mx-auto lg:px-16 space-y-6 md:space-y-8 flex-col items-center">
      {projects.map((project, index) => (
        <ProjectLayout {...project} key={index}></ProjectLayout>
      ))}
    </div>
  );
};

export default ProjectList;
