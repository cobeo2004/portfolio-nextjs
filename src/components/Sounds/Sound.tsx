"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ListMusic,
  X,
  Music as MusicIcon,
  Shuffle,
  Repeat1,
} from "lucide-react";
import { Modal } from "./consent.modal";
import Image from "next/image";
import { useSounds } from "@/hooks/useSounds";

const Sound = () => {
  const {
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
    setShowModal,
    setIsShuffle,
    setIsRepeatOne,
  } = useSounds();

  return (
    <div className="fixed top-4 right-2.5 xs:right-4 z-50 flex flex-col items-end gap-2">
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          toggle={() => {
            const randomIndex = Math.floor(Math.random() * musicList.length);
            setCurrentSongIndex(randomIndex);
            setIsPlaying(true);
            setShowModal(false);
          }}
        />
      )}

      <audio
        ref={audioRef}
        loop={isRepeatOne}
        src={currentSong?.musicUrl || "/assets/audio/harry-potter.mp3"}
        onEnded={nextSong}
      >
        Your browser does not support the audio element.
      </audio>

      {/* Main Toggle Button / Mini Player */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="w-10 h-10 xs:w-14 xs:h-14 text-foreground rounded-full flex items-center justify-center cursor-pointer p-2.5 xs:p-4 custom-background shadow-lg border border-accent/20"
      >
        {isPlaying ? (
          <Volume2
            className="w-full h-full text-foreground hover:text-accent animate-pulse"
            strokeWidth={1.5}
          />
        ) : (
          <VolumeX
            className="w-full h-full text-foreground hover:text-accent"
            strokeWidth={1.5}
          />
        )}
      </motion.button>

      {/* Expanded Player Interface */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-16 right-0 w-80 bg-background/90 backdrop-blur-md rounded-xl border border-accent/20 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header / Close */}
            <div className="p-4 border-b border-muted/20 flex justify-between items-center">
              <span className="text-sm font-medium text-accent flex items-center gap-2">
                <ListMusic size={16} /> Music Player
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="hover:text-accent transition-colors"
                aria-label="Close player"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Song Details */}
            <div className="p-4 flex flex-col items-center text-center gap-3">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-lg border border-muted/20 group">
                {currentSong?.coverUrl ? (
                  <Image
                    src={currentSong.coverUrl}
                    alt={currentSong.name}
                    fill
                    className={`object-cover ${
                      isPlaying ? "scale-110" : "scale-100"
                    } transition-transform duration-700`}
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                    <MusicIcon size={40} className="text-muted" />
                  </div>
                )}
                {/* Overlay Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-accent transform hover:scale-110 transition-all"
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                </div>
              </div>

              <div className="w-full space-y-1">
                <h3 className="font-bold text-foreground truncate text-lg">
                  {currentSong?.name || "Unknown Song"}
                </h3>
                <p className="text-sm text-muted truncate">
                  {currentSong?.artist || "Unknown Artist"}
                </p>
                <div className="w-full overflow-hidden relative group/desc">
                  <motion.div
                    className="whitespace-nowrap inline-block text-xs text-muted/70 italic"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "loop",
                    }}
                  >
                    <span className="mr-8">
                      {currentSong?.description || "No description provided"}
                    </span>
                    <span className="mr-8">
                      {currentSong?.description || "No description provided"}
                    </span>
                  </motion.div>
                  <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-background/90 to-transparent z-10" />
                  <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-background/90 to-transparent z-10" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-2 ml-8">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`transition-colors transform hover:scale-110 ${
                    isShuffle
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                  title="Shuffle"
                >
                  <Shuffle size={18} />
                </button>
                <div className="flex items-center gap-6">
                  <button
                    onClick={prevSong}
                    className="text-muted hover:text-accent transition-colors transform hover:-translate-x-1"
                  >
                    <SkipBack size={24} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 border border-accent/50 text-accent hover:bg-accent hover:text-background transition-all"
                  >
                    {isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" className="ml-1" />
                    )}
                  </button>
                  <button
                    onClick={nextSong}
                    className="text-muted hover:text-accent transition-colors transform hover:-translate-x-1"
                  >
                    <SkipForward size={24} />
                  </button>
                </div>
                <button
                  onClick={() => setIsRepeatOne(!isRepeatOne)}
                  className={`transition-colors transform hover:scale-110 ${
                    isRepeatOne
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                  title="Repeat One"
                >
                  <Repeat1 size={18} />
                </button>
                {/* Placeholder to balance shuffle button */}
                <div className="w-[18px]" />
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 w-full mt-2 px-2">
                {volume === 0 ? (
                  <VolumeX size={16} className="text-muted" />
                ) : (
                  <Volume2 size={16} className="text-muted" />
                )}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-muted/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
                />
              </div>
            </div>

            {/* Playlist */}
            <div className="border-t border-muted/20 bg-black/20">
              <div className="p-3 bg-muted/5 text-xs font-semibold text-muted uppercase tracking-wider">
                Up Next
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {musicList.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => playSong(index)}
                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors ${
                      currentSongIndex === index
                        ? "bg-accent/10 border-l-2 border-accent"
                        : ""
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      {song.coverUrl ? (
                        <Image
                          src={song.coverUrl}
                          alt={song.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                          <MusicIcon size={16} />
                        </div>
                      )}
                      {currentSongIndex === index && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-[2px]">
                          <motion.div
                            animate={{ height: ["40%", "100%", "40%"] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-1 bg-accent"
                          />
                          <motion.div
                            animate={{ height: ["30%", "80%", "30%"] }}
                            transition={{
                              duration: 0.4,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 0.1,
                            }}
                            className="w-1 bg-accent"
                          />
                          <motion.div
                            animate={{ height: ["50%", "90%", "50%"] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 0.2,
                            }}
                            className="w-1 bg-accent"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-medium truncate ${
                          currentSongIndex === index
                            ? "text-accent"
                            : "text-foreground"
                        }`}
                      >
                        {song.name}
                      </h4>
                      <p className="text-xs text-muted truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sound;
