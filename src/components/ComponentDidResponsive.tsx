import React from "react";
import { useScreenSize } from "../hooks/useScreenSize";

const ComponentDidResponsive: React.FC<{
  children: (props: { size: number | undefined }) => React.ReactNode;
}> = ({ children }) => {
  const size = useScreenSize();

  return <>{children({ size })}</>;
};

export default ComponentDidResponsive;
