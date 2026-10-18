"use client";

import Link from "next/link";
import type React from "react";
import { useSite } from "@/hooks/useSite";

type TTransitionLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
};

// A Next.js <Link> that plays the stair-column wipe before the route changes.
export default function TransitionLink({
  href,
  onClick,
  ...props
}: TTransitionLinkProps) {
  const { navigate } = useSite();
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
