"use client";

import { BtnList } from "@/app/data";
import React from "react";
import NavButton from "../buttons/nav.button";

const Navigation = () => {
  const angle = 360 / BtnList.length;

  return (
    <div className="w-full fixed h-screen flex items-center justify-center z-20">
      <div className="w-max flex items-center justify-center relative hover:pause animate-spin-slow group">
        {BtnList.map((btn, index) => {
          const radian = (angle * index * Math.PI) / 180;
          const radius = "calc(20vw - 1rem)";
          const xCoord = `calc(${radius} * ${Math.cos(radian)})`;
          const yCoord = `calc(${radius} * ${Math.sin(radian)})`;
          return <NavButton key={btn.label} x={xCoord} y={yCoord} {...btn} />;
        })}
      </div>
    </div>
  );
};

export default Navigation;
