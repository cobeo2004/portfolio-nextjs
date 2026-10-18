import { useContext } from "react";
import { SiteContext } from "@/providers/SiteProvider";

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
};
