"use client";

import { TNavButtonProps } from "@/app/types";

import Link from "next/link";
import React from "react";
import getIcon from "../icons";
import ComponentDidResponsive from "@/app/ComponentDidResponsive";
import clsx from "clsx";

const NavButton = ({
  x,
  y,
  label,
  link,
  icon,
  newTab,
  labelDirection = "right",
}: TNavButtonProps) => {
  return (
    <ComponentDidResponsive>
      {({ size }) => {
        return size && size >= 480 ? (
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
        ) : (
          <>
            <div className="w-fit cursor-pointer">
              <Link
                aria-label={label}
                target={newTab ? "_blank" : "_self"}
                href={link}
                className="text-foreground rounded-full flex items-center justify-center group custom-background"
              >
                <span className="relative w-10 h-10 xs:w-14 xs:h-14 p-[8px] xs:p-4 hover:text-accent">
                  {getIcon(icon)}
                  <span className="peer bg-transparent absolute top-0 left-0 w-full h-full" />
                  <span
                    className={clsx(
                      "absolute hidden peer-hover:block px-2 py-1 left-full mx-2 top-1/2 -translate-y-1/2 bg-background text-foreground text-sm rounded-md shadow-lg whitespace-nowrap",
                      labelDirection === "left" ? "right-full left-auto" : ""
                    )}
                  >
                    {label}
                  </span>
                </span>
              </Link>
            </div>
          </>
        );
      }}
    </ComponentDidResponsive>
  );
};

export default NavButton;
