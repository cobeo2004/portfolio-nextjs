"use client";
import React from "react";

function YepAssistance({ zIndex = 50 }: { zIndex?: number }) {
  return (
    <>
      <iframe
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          zIndex: zIndex,
          width: "100%",
          height: "100%",
        }}
        allow="microphone"
        src={process.env.NEXT_PUBLIC_YEP_AI_URL}
      ></iframe>
    </>
  );
}

export default YepAssistance;
