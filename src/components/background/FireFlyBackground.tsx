"use client";

import React, { useEffect, useState } from "react";

type FireFlyReturnType = {
  id: number;
  top: string;
  left: string;
  animationDuration: string;
};
const createFireFly = (): FireFlyReturnType => {
  return {
    id: Math.random(),
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 5 + 5}s`,
  };
};
const FireFlyBackground = () => {
  const [fireFlies, setfireFlies] = useState<FireFlyReturnType[]>([]);

  useEffect(() => {
    const addFireFlyInterval = () => {
      const newFireFly = createFireFly();
      setfireFlies((current) => [...current, newFireFly]);
    };

    const int = setInterval(addFireFlyInterval, 3000);

    return () => clearInterval(int);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
      {fireFlies.map((fireFly) => (
        <div
          key={fireFly.id}
          className="absolute rounded-full w-[10px] h-[10px] bg-firefly-radial"
          style={{
            top: fireFly.top,
            left: fireFly.left,
            animation: `move ${fireFly.animationDuration} infinite alternate`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default FireFlyBackground;
