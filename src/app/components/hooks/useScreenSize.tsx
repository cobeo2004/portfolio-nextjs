"use client";

import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [screenSize, setscreenSize] = useState<number>(1024);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getScreenSize = () => window.innerWidth;
      const handleResize = () => {
        setscreenSize(getScreenSize());
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  return screenSize;
};
