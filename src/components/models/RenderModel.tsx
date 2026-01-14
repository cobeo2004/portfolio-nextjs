"use client";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { Suspense, type JSX } from "react";

const RenderModel = ({
  children,
  className,
}: Partial<{
  children: JSX.Element;
  className: string;
}>) => {
  return (
    <Canvas className={clsx("w-screen h-screen relative", className)}>
      <Suspense fallback={null}>{children}</Suspense>
      <Environment preset="dawn" />
    </Canvas>
  );
};

export default RenderModel;
