"use client";

import { TNavButtonProps } from "@/app/types";

import Link from "next/link";
import React from "react";
import getIcon from "../icons";

const NavButton = ({ x, y, label, link, icon, newTab }: TNavButtonProps) => {
  return (
    <div
      className="absolute cursor-pointer"
      style={{ transform: `translate(${x}, ${y})` }}
    >
      <Link
        aria-label={label}
        target={newTab ? "_blank" : "_self"}
        href={link}
        className="text-foreground rounded-full flex items-center justify-center group custom-background"
      >
        <span className="relative w-14 h-14 p-4 animate-spin-slow-rev hover:text-accent group-hover:pause">
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
