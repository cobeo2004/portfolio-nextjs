"use client";

import { TNavButtonProps } from "@/app/types";
import {
  Github,
  HomeIcon,
  House,
  Linkedin,
  NotebookIcon,
  Palette,
  Phone,
  Twitter,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const getIcon = (icon: string) => {
  switch (icon) {
    case "home":
      return <House strokeWidth={1.5} className="w-auto h-auto" />;
    case "about":
      return <User strokeWidth={1.5} className="w-auto h-auto" />;
    case "projects":
      return <Palette strokeWidth={1.5} className="w-auto h-auto" />;
    case "contact":
      return <Phone strokeWidth={1.5} className="w-auto h-auto" />;
    case "github":
      return <Github strokeWidth={1.5} className="w-auto h-auto" />;
    case "twitter":
      return <Twitter strokeWidth={1.5} className="w-auto h-auto" />;
    case "linkedin":
      return <Linkedin strokeWidth={1.5} className="w-auto h-auto" />;
    case "resume":
      return <NotebookIcon strokeWidth={1.5} className="w-auto h-auto" />;
    default:
      return <HomeIcon strokeWidth={1.5} className="w-auto h-auto" />;
  }
};
const NavButton = ({ x, y, label, link, icon, newTab }: TNavButtonProps) => {
  return (
    <div
      className="absolute z-50 cursor-pointer"
      style={{ transform: `translate(${x}, ${y})` }}
    >
      <Link
        aria-label={label}
        target={newTab ? "_blank" : "_self"}
        href={link}
        className="text-foreground rounded-full flex items-center justify-center group bg-background/20 border border-accent/30 border-solid backdrop-blur-[6px] shadow-glass-inset hover:shadow-glass-sm "
      >
        <span className="relative w-14 h-14 p-4 animate-spin-slow-rev group-hover:text-accent">
          {getIcon(icon)}
          <span className="peer bg-transparent absolute top-0 left-0 w-full h-full" />
          <span className="absolute hidden peer-hover:block px-2 py-1 left-full mx-2 top-1/2 -translate-y-1/2 bg-background text-foreground text-sm rounded-md shadow-lg whitespace-nowrap">
            {label}
          </span>
        </span>
      </Link>
    </div>
  );
};

export default NavButton;
