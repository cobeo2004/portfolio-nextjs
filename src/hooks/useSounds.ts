import { musicDb } from "@/lib/data";
import { useEffect, useRef, useState } from "react";

export const useSounds = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeatOne, setIsRepeatOne] = useState<boolean>(false);

  const musicList = musicDb();
  const currentSong = musicList[currentSongIndex];

  useEffect(() => {
    // Initial consent check logic preserved and adapted
    const handleFirstUserInteraction = (consent: string): void => {
      if (consent === "true" && !isPlaying) {
        audioRef.current?.play().catch(() => {});
        setIsPlaying(true);
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
      if (isPlayingMusic === "true") {
        setIsPlaying(true);
        ["mousedown", "keydown", "touchstart"].forEach((event) => {
          window.addEventListener(
            event,
            () => handleFirstUserInteraction(isPlayingMusic),
            { once: true }
          );
        });
      }
    } else {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (isPlaying) {
      audioRef.current
        ?.play()
        .catch((e) => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
    sessionStorage.setItem("isPlayingMusic", String(isPlaying));
    sessionStorage.setItem("timeStamp", new Date().toISOString());
  }, [isPlaying, currentSongIndex, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const nextSong = () => {
    if (isShuffle) {
      // Pick a random index distinct from current one if possible
      let nextIndex = Math.floor(Math.random() * musicList.length);
      while (nextIndex === currentSongIndex && musicList.length > 1) {
        nextIndex = Math.floor(Math.random() * musicList.length);
      }
      setCurrentSongIndex(nextIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % musicList.length);
    }
  };

  const prevSong = () => {
    setCurrentSongIndex(
      (prev) => (prev - 1 + musicList.length) % musicList.length
    );
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
  };

  return {
    audioRef,
    isPlaying,
    showModal,
    isExpanded,
    currentSongIndex,
    volume,
    isShuffle,
    isRepeatOne,
    musicList,
    currentSong,
    togglePlay,
    playSong,
    nextSong,
    prevSong,
    handleVolumeChange,
    setIsPlaying,
    setIsExpanded,
    setCurrentSongIndex,
    setVolume,
    setIsShuffle,
    setShowModal,
    setIsRepeatOne,
  };
};
