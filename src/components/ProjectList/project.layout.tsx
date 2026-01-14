"use client";
import { TProjectList } from "@/types";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Star, Eye, Code2, Copy, Calendar } from "lucide-react";

const item: Variants = {
  hidden: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
};

const NavLink = motion(Link);

const ProjectLayout = ({
  name,
  description,
  date,
  demoLink,
  language,
  stargazers_count,
  watchers_count,
  is_template,
}: TProjectList) => {
  return (
    <NavLink
      variants={item}
      href={demoLink}
      target={"_blank"}
      className="group flex flex-col w-full relative rounded-xl overflow-hidden p-4 md:p-6 custom-background border border-accent/10 hover:border-accent/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
            {name}
          </h2>
          {is_template && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
              <Copy size={12} />
              Template
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-muted group-hover:text-foreground transition-colors">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="text-accent/60" />
            <span className="text-sm font-medium">{stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={16} className="text-accent/60" />
            <span className="text-sm font-medium">{watchers_count}</span>
          </div>
        </div>
      </div>

      <p className="text-muted text-sm md:text-base mb-6 line-clamp-2 min-h-[3rem]">
        {description || "No description provided."}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-accent/5">
        <div className="flex items-center gap-4">
          {language && (
            <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted">
              <Code2 size={14} className="text-accent/60" />
              <span>{language}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted">
          <Calendar size={14} className="text-accent/60" />
          <span>
            {new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent group-hover:w-full transition-all duration-500" />
    </NavLink>
  );
};

export default ProjectLayout;
