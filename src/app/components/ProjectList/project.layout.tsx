import { TProjectList } from "@/app/types";
import Link from "next/link";
import React from "react";

const ProjectLayout = ({ name, description, date, demoLink }: TProjectList) => {
  return (
    <Link
      href={demoLink}
      target={"_blank"}
      className="flex cursor-pointer items-center justify-between w-full relative rounded-lg overflow-hidden p-6 custom-background"
    >
      <div className="flex items-center justify-center space-x-2">
        <h2 className="text-foreground">{name}</h2>
        <p className="text-muted">{description}</p>
      </div>
      <div className="flex-1 mx-2 mb-2 bg-transparent border-b border-dashed border-muted self-end" />
      <p className="text-foreground">{new Date(date).toDateString()}</p>
    </Link>
  );
};

export default ProjectLayout;
