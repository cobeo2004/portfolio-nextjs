"use client";

import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [screenSize, setscreenSize] = useState<number>(1024);
  useEffect(() => {
    const getScreenSize = () => window.innerWidth;
    const handleResize = () => {
      setscreenSize(getScreenSize());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return screenSize;
};
