"use client";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "./consent.modal";

const Sound = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const handleFirstUserInteraction = (consent: string): void => {
      if (consent === "true" && !isPlay) {
        audioRef.current?.play();
        setIsPlay(true);
      }
    };

    const isPlayingMusic: string | null =
      sessionStorage.getItem("isPlayingMusic");

    const timeStamp: string | null = sessionStorage.getItem("timeStamp");

    if (
      isPlayingMusic &&
      timeStamp &&
      new Date(timeStamp).getTime() * 3 * 24 * 60 * 60 * 1000 >
        new Date().getTime()
    ) {
      setIsPlay(isPlayingMusic === "true");
      if (isPlayingMusic === "true") {
        ["mousedown", "keydown", "touchstart"].forEach((event) => {
          window.addEventListener(event, () =>
            handleFirstUserInteraction(isPlayingMusic)
          );
        });
      }
    } else {
      setShowModal(true);
    }
  }, [isPlay]);
  const toggle = () => {
    const state = !isPlay;
    setIsPlay(state);
    !isPlay ? audioRef.current?.play() : audioRef.current?.pause();
    sessionStorage.setItem("isPlayingMusic", String(state));
    sessionStorage.setItem("timeStamp", new Date().toISOString());
    setShowModal(false);
  };
  return (
    <div className="fixed top-4 right-2.5 xs:right-4 group z-50">
      {showModal && (
        <Modal onClose={() => setShowModal(false)} toggle={toggle} />
      )}
      <audio ref={audioRef} loop>
        <source src="/assets/audio/harry-potter.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <motion.button
        onClick={toggle}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        aria-label={"home"}
        className="w-10 h-10 xs:w-14 xs:h-14 text-foreground rounded-full flex items-center justify-center cursor-pointer p-2.5 xs:p-4 custom-background"
      >
        {isPlay ? (
          <Volume2
            className="w-full h-full text-foreground group-hover:text-accent"
            strokeWidth={1.5}
          />
        ) : (
          <VolumeX
            className="w-full h-full text-foreground group-hover:text-accent"
            strokeWidth={1.5}
          />
        )}
      </motion.button>
    </div>
  );
};

export default Sound;
