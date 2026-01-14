"use client";

import { BtnList } from "@/lib/data";
import React from "react";
import NavButton from "../buttons/nav.button";
import { useScreenSize } from "../../hooks/useScreenSize";
import ComponentDidResponsive from "@/components/ComponentDidResponsive";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};
const Navigation = () => {
  const angle = 360 / BtnList.length;
  const size = useScreenSize();
  const isLarge = size !== undefined && size >= 1024;
  const isMedium = size !== undefined && size >= 768;

  return (
    <div className="w-full fixed h-screen flex items-center justify-center z-20 cursor-pointer">
      <ComponentDidResponsive>
        {({ size }) => {
          return size && size >= 480 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="w-max flex items-center justify-center relative hover:pause animate-spin-slow group"
            >
              {BtnList.map((btn, index) => {
                const radian = (angle * index * Math.PI) / 180;
                const radius = isLarge
                  ? "calc(20vw - 1rem)"
                  : isMedium
                  ? "calc(30vw - 1rem)"
                  : "calc(40vw - 1rem)";
                const xCoord = `calc(${radius} * ${Math.cos(radian)})`;
                const yCoord = `calc(${radius} * ${Math.sin(radian)})`;
                return (
                  <NavButton key={btn.label} x={xCoord} y={yCoord} {...btn} />
                );
              })}
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="w-full px-2.5 xs:p-0 xs:w-max flex flex-col items-start xs:items-center space-y-4 justify-center relative group"
              >
                {BtnList.slice(0, BtnList.length / 2).map((btn, index) => {
                  return <NavButton key={btn.label} x={0} y={0} {...btn} />;
                })}
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="w-full px-2.5 xs:p-0 xs:w-max flex flex-col items-end xs:items-center space-y-4 justify-center relative group"
              >
                {BtnList.slice(BtnList.length / 2, BtnList.length).map(
                  (btn, index) => {
                    return (
                      <NavButton
                        key={btn.label}
                        x={0}
                        y={0}
                        labelDirection="left"
                        {...btn}
                      />
                    );
                  }
                )}
              </motion.div>
            </>
          );
        }}
      </ComponentDidResponsive>
    </div>
  );
};

export default Navigation;
