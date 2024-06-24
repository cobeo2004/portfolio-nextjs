"use client";

import { BtnList } from "@/app/data";
import React from "react";
import NavButton from "./NavButton";

const Navigation = () => {
  const angle = 360 / BtnList.length;

  return (
    <div className="w-full fixed h-screen flex items-center justify-center z-20">
      <div className="w-max flex items-center justify-between relative animate-spin-slow">
        {BtnList.map((btn, index) => {
          const radian = (angle * index * Math.PI) / 180;
          const radius = "calc(20vw - 1rem)";
          const xCoord = `calc(${radius} * ${Math.cos(radian)})`;
          const yCoord = `calc(${radius} * ${Math.sin(radian)})`;
          return <NavButton key={btn.label} x={xCoord} y={yCoord} {...btn} />;
          //   return (
          //     <button
          //       key={index}
          //       className="absolute"
          //       style={{
          //         transform: `translate(${xCoord}, ${yCoord})`,
          //       }}
          //     >
          //       {btn.label}
          //     </button>
          //   );
        })}
      </div>
    </div>
  );
};

export default Navigation;
