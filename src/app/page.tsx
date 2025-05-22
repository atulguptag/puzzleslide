"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  RotateCcw,
  Info,
  Settings,
  X,
  CircleHelp,
  Moon,
  Sun,
  VolumeX,
  Volume2,
} from "lucide-react";
import { createPortal } from "react-dom";
import { Poppins, Dancing_Script } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface Score {
  moves: number;
  time: number;
  gridSize: number;
  date: string;
}

interface ImageOption {
  src: string;
  name: string;
}

interface TileProps {
  index: number;
  tileValue: number | null;
  gridSize: number;
  imageSrc: string;
  onClick: (index: number) => void;
  canMove: boolean;
  isDarkMode: boolean;
}

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  highScores: Score[];
  isDarkMode: boolean;
  formatTime: (seconds: number) => string;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  playSound: (soundType: "slide" | "win" | "click") => void;
}

interface GameWonModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  time: number;
  gridSize: number;
  isDarkMode: boolean;
  formatTime: (seconds: number) => string;
  onPlayAgain: () => void;
  onViewScores: () => void;
}

interface GameHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  showScoreboard: () => void;
  showInfo: () => void;
  showSettings: () => void;
  moves: number;
  time: number;
  formatTime: (seconds: number) => string;
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (soundType: "slide" | "win" | "click") => void;
}

interface SplashScreenProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  gridSize: number;
  setGridSize: (size: number) => void;
  selectedImage: string;
  setSelectedImage: (src: string) => void;
  availableImages: ImageOption[];
  imageLoaded: boolean;
  initGame: (forceShuffling: boolean) => void;
  playSound: (soundType: "slide" | "win" | "click") => void;
}

const ImageContainer: React.FC<{
  gridSize: number;
  imageSrc: string;
  onLoad: (success: boolean) => void;
}> = ({ gridSize, imageSrc, onLoad }) => {
  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      onLoad(true);
    };

    img.onerror = () => onLoad(false);
    img.src = imageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, gridSize, onLoad]);

  return null;
};

const Tile: React.FC<TileProps> = ({
  index,
  tileValue,
  gridSize,
  imageSrc,
  onClick,
  canMove,
  isDarkMode,
}) => {
  if (tileValue === null) {
    return (
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${
          isDarkMode
            ? "from-slate-800 via-slate-700 to-slate-800"
            : "from-gray-100 via-white to-gray-100"
        } border-4 border-dashed ${
          isDarkMode ? "border-indigo-400/40" : "border-indigo-300/60"
        } shadow-inner cursor-pointer transition-all duration-300 hover:border-indigo-400/60`}
        onClick={() => onClick(index)}
      />
    );
  }

  const row = Math.floor((tileValue - 1) / gridSize);
  const col = (tileValue - 1) % gridSize;

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      className={`absolute inset-0 cursor-pointer rounded-xl overflow-hidden shadow-xl border-2 ${
        isDarkMode ? "border-slate-600/50" : "border-white/80"
      } ${
        canMove ? "hover:scale-105 hover:shadow-2xl" : ""
      } transition-all duration-200`}
      whileHover={{ scale: canMove ? 1.05 : 1, rotate: canMove ? 1 : 0 }}
      whileTap={{ scale: canMove ? 0.95 : 1 }}
      onClick={() => onClick(index)}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: `${gridSize * 100}%`,
          backgroundPosition: `${-col * 100}% ${-row * 100}%`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-sm font-bold ${
            isDarkMode
              ? "bg-slate-900/80 text-slate-100 border border-slate-600"
              : "bg-white/90 text-slate-800 border border-gray-300"
          } px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
        >
          {tileValue}
        </span>
      </div>
    </motion.div>
  );
};

const GameHeader: React.FC<GameHeaderProps> = ({
  isDarkMode,
  toggleTheme,
  showScoreboard,
  showInfo,
  showSettings,
  moves,
  time,
  formatTime,
  isMuted,
  toggleMute,
  playSound,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mx-auto py-4 md:py-6 px-4 md:px-6 gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-xl">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-lg transform rotate-45"></div>
          </div>
          <div>
            <h1
              className={`${
                dancingScript.className
              } text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode
                  ? "from-purple-300 via-indigo-300 to-cyan-300"
                  : "from-purple-600 via-indigo-600 to-cyan-600"
              }`}
            >
              PuzzleSlide
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
        <div
          className={`flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 rounded-2xl backdrop-blur-lg shadow-xl border ${
            isDarkMode
              ? "bg-slate-800/60 border-slate-600/50 text-slate-200"
              : "bg-white/60 border-gray-200/50 text-gray-800"
          }`}
        >
          <span className="text-xs md:text-sm font-semibold">
            Moves: {moves}
          </span>
        </div>
        <div
          className={`flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 rounded-2xl backdrop-blur-lg shadow-xl border ${
            isDarkMode
              ? "bg-slate-800/60 border-slate-600/50 text-slate-200"
              : "bg-white/60 border-gray-200/50 text-gray-800"
          }`}
        >
          <span className="text-xs md:text-sm font-semibold">
            Time: {formatTime(time)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={() => {
            playSound("click");
            toggleMute();
          }}
          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-lg transition-all duration-300 cursor-pointer shadow-xl border ${
            isDarkMode
              ? "bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/60"
              : "bg-white/60 border-gray-200/50 text-gray-800 hover:bg-gray-50/80"
          }`}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          onClick={() => {
            playSound("click");
            toggleTheme();
          }}
          className={`p-2 md:p-3 rounded-2xl backdrop-blur-lg transition-all duration-300 cursor-pointer shadow-xl border ${
            isDarkMode
              ? "bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/60"
              : "bg-white/60 border-gray-200/50 text-gray-800 hover:bg-gray-50/80"
          }`}
        >
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button
          onClick={() => {
            playSound("click");
            showInfo();
          }}
          className={`p-2 md:p-3 rounded-2xl backdrop-blur-lg transition-all duration-300 cursor-pointer shadow-xl border ${
            isDarkMode
              ? "bg-slate-800/60 border-slate-600/50 text-indigo-300 hover:bg-slate-700/60"
              : "bg-white/60 border-gray-200/50 text-indigo-600 hover:bg-gray-50/80"
          }`}
        >
          <Info size={18} />
        </button>
        <button
          onClick={() => {
            playSound("click");
            showScoreboard();
          }}
          className={`p-2 md:p-3 rounded-2xl backdrop-blur-lg transition-all duration-300 cursor-pointer shadow-xl border ${
            isDarkMode
              ? "bg-slate-800/60 border-slate-600/50 text-amber-300 hover:bg-slate-700/60"
              : "bg-white/60 border-gray-200/50 text-amber-600 hover:bg-gray-50/80"
          }`}
        >
          <Trophy size={18} />
        </button>
        <button
          onClick={() => {
            playSound("click");
            showSettings();
          }}
          className={`p-2 md:p-3 rounded-2xl backdrop-blur-lg transition-all duration-300 cursor-pointer shadow-xl border ${
            isDarkMode
              ? "bg-slate-800/60 border-slate-600/50 text-emerald-300 hover:bg-slate-700/60"
              : "bg-white/60 border-gray-200/50 text-emerald-600 hover:bg-gray-50/80"
          }`}
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

const ScoreboardModal = React.memo(
  ({ onClose, highScores, isDarkMode, formatTime }: ScoreboardModalProps) => {
    if (typeof document === "undefined") return null;

    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className={`${poppins.className} relative z-10 ${
            isDarkMode
              ? "bg-slate-800 border-slate-600 text-slate-100"
              : "bg-white border-gray-200 text-gray-900"
          } border shadow-2xl rounded-3xl p-4 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-auto`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center space-x-2 md:space-x-3">
              <Trophy className="text-amber-500" size={24} />
              <span>High Scores</span>
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-2xl transition-colors cursor-pointer ${
                isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
              }`}
            >
              <X size={24} />
            </button>
          </div>

          {highScores.length > 0 ? (
            <div className="overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <div>Grid</div>
                <div>Moves</div>
                <div>Time</div>
                <div>Date</div>
              </div>
              <div className="space-y-2 md:space-y-3">
                {highScores.map((score, i) => (
                  <motion.div
                    key={`score-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`grid grid-cols-4 gap-2 md:gap-4 p-3 md:p-4 rounded-2xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-gray-50"
                    } border ${
                      isDarkMode ? "border-slate-600" : "border-gray-200"
                    }`}
                  >
                    <div className="font-semibold text-sm md:text-lg">
                      {score.gridSize}×{score.gridSize}
                    </div>
                    <div className="font-medium text-sm md:text-base">
                      {score.moves}
                    </div>
                    <div className="font-medium text-sm md:text-base">
                      {formatTime(score.time)}
                    </div>
                    <div className="text-xs md:text-sm">
                      {new Date(score.date).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg md:text-xl text-gray-500">
                No high scores yet!
              </p>
              <p className="text-sm md:text-base text-gray-400 mt-2">
                Complete a game to set your first record.
              </p>
            </div>
          )}

          <div className="flex justify-center mt-6 md:mt-8">
            <button
              className="py-2 md:py-3 px-6 md:px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-xl transition-all duration-300 cursor-pointer"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>,
      document.body
    );
  }
);
ScoreboardModal.displayName = "ScoreboardModal";

const InfoModal = React.memo(
  ({ onClose, isDarkMode, playSound }: InfoModalProps) => {
    if (typeof document === "undefined") return null;

    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className={`${poppins.className} relative z-10 ${
            isDarkMode
              ? "bg-slate-800 border-slate-600 text-slate-100"
              : "bg-white border-gray-200 text-gray-900"
          } border shadow-2xl rounded-3xl p-4 md:p-8 max-w-md w-full`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center space-x-2 md:space-x-3">
              <CircleHelp className="text-indigo-500" size={24} />
              <span>How to Play</span>
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-2xl transition-colors cursor-pointer ${
                isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
              }`}
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white font-bold text-lg md:text-xl">
                    1
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                  Click to Move
                </h3>
                <p
                  className={`text-sm md:text-base ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Click on tiles adjacent to the empty space to move them into
                  position.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white font-bold text-lg md:text-xl">
                    2
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                  Complete the Picture
                </h3>
                <p
                  className={`text-sm md:text-base ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Rearrange all tiles in numerical order to reveal the complete
                  image.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white font-bold text-lg md:text-xl">
                    3
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                  Beat Your Records
                </h3>
                <p
                  className={`text-sm md:text-base ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Try different grid sizes and images. Your best scores are
                  saved automatically!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 md:mt-8">
            <button
              className="py-2 md:py-3 px-6 md:px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => {
                playSound("click");
                onClose();
              }}
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </div>,
      document.body
    );
  }
);
InfoModal.displayName = "InfoModal";

const GameWonModal = React.memo(
  ({
    onClose,
    moves,
    time,
    gridSize,
    isDarkMode,
    formatTime,
    onPlayAgain,
    onViewScores,
  }: GameWonModalProps) => {
    if (typeof document === "undefined") return null;

    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className={`${poppins.className} relative z-10 ${
            isDarkMode
              ? "bg-slate-800 border-slate-600 text-slate-100"
              : "bg-white border-gray-200 text-gray-900"
          } border shadow-2xl rounded-3xl p-4 md:p-8 max-w-lg w-full`}
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-2 md:mb-4">🎉</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Congratulations!
            </h2>
            <p
              className={`text-base md:text-xl mb-4 md:mb-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              You solved the puzzle!
            </p>

            <div
              className={`p-4 md:p-6 rounded-2xl mb-6 md:mb-8 ${
                isDarkMode ? "bg-slate-700/50" : "bg-gray-50"
              }`}
            >
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="text-center">
                  <p className="text-xs md:text-sm uppercase tracking-wider font-medium text-gray-500 mb-1 md:mb-2">
                    Moves
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-purple-600">
                    {moves}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm uppercase tracking-wider font-medium text-gray-500 mb-1 md:mb-2">
                    Time
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-indigo-600">
                    {formatTime(time)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm uppercase tracking-wider font-medium text-gray-500 mb-1 md:mb-2">
                    Grid Size
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-cyan-600">
                    {gridSize}×{gridSize}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <button
                className="flex-1 py-3 px-4 md:px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl flex items-center justify-center font-semibold shadow-xl transition-all duration-300 cursor-pointer"
                onClick={onPlayAgain}
              >
                <RotateCcw className="mr-2" size={18} />
                Play Again
              </button>
              <button
                className="flex-1 py-3 px-4 md:px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl flex items-center justify-center font-semibold shadow-xl transition-all duration-300 cursor-pointer"
                onClick={onViewScores}
              >
                <Trophy className="mr-2" size={18} />
                View Scores
              </button>
            </div>
          </div>
        </motion.div>
      </div>,
      document.body
    );
  }
);
GameWonModal.displayName = "GameWonModal";

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" },
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { delay: 0.3, duration: 0.6 },
        }}
        exit={{ scale: 1.2, opacity: 0 }}
        className="text-center px-4"
      >
        <motion.div
          className="flex items-center justify-center mb-6 md:mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        >
          <div className="h-16 w-16 md:h-24 md:w-24 rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-2xl transform rotate-45"></div>
          </div>
        </motion.div>
        <h1
          className={`${dancingScript.className} text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 mb-2 md:mb-4`}
        >
          PuzzleSlide
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 font-light">
          Slide • Solve • Succeed
        </p>
        <motion.div
          className="mt-6 md:mt-8 w-24 md:w-32 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mx-auto"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

const SettingsPanel = React.memo(
  ({
    isOpen,
    onClose,
    isDarkMode,
    gridSize,
    setGridSize,
    selectedImage,
    setSelectedImage,
    availableImages,
    imageLoaded,
    initGame,
    playSound,
  }: SettingsPanelProps) => {
    if (typeof document === "undefined") return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex justify-end">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              <motion.div
                className={`${poppins.className} relative z-10 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-slate-100"
                    : "bg-white border-gray-200 text-gray-900"
                } border-l shadow-2xl w-full max-w-md h-full overflow-auto p-4 md:p-8`}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold flex items-center space-x-2 md:space-x-3">
                    <Settings className="text-emerald-500" size={24} />
                    <span>Settings</span>
                  </h2>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-2xl transition-colors cursor-pointer ${
                      isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div>
                    <label
                      className={`block mb-3 md:mb-4 text-base md:text-lg font-semibold ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Grid Size
                    </label>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {[3, 4, 5].map((size) => (
                        <button
                          key={`grid-size-${size}`}
                          onClick={() => setGridSize(size)}
                          className={`py-3 md:py-4 px-3 md:px-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer ${
                            gridSize === size
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl border-2 border-purple-500"
                              : isDarkMode
                              ? "bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-slate-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200"
                          }`}
                        >
                          {size}×{size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block mb-3 md:mb-4 text-base md:text-lg font-semibold ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Choose Image
                    </label>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {availableImages.map((img, index) => (
                        <button
                          key={`image-${index}-${img.name}`}
                          onClick={() => {
                            setSelectedImage(img.src);
                          }}
                          className={`relative rounded-2xl overflow-hidden aspect-square transition-all duration-300 cursor-pointer ${
                            selectedImage === img.src
                              ? "ring-4 ring-purple-500 shadow-2xl transform scale-105"
                              : "hover:shadow-xl hover:scale-102"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.src}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <span className="text-xs md:text-sm text-white font-semibold px-2 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                              {img.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (imageLoaded) {
                        initGame(true);
                        onClose();
                        playSound("click");
                      }
                    }}
                    className={`w-full py-3 md:py-4 px-4 md:px-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-2xl flex items-center justify-center font-semibold shadow-xl transition-all duration-300 ${
                      !imageLoaded
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                    }`}
                    disabled={!imageLoaded}
                  >
                    <RotateCcw className="mr-2 md:mr-3" size={18} />
                    Start New Game
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>,
      document.body
    );
  }
);
SettingsPanel.displayName = "SettingsPanel";

export default function Home() {
  const [gridSize, setGridSize] = useState(3);
  const [tiles, setTiles] = useState<(number | null)[]>([]);
  const [emptyIndex, setEmptyIndex] = useState(gridSize * gridSize - 1);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=800&h=800&fit=crop&crop=entropy"
  );
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [audioFiles, setAudioFiles] = useState<{
    slide: HTMLAudioElement | null;
    win: HTMLAudioElement | null;
    click: HTMLAudioElement | null;
  }>({ slide: null, win: null, click: null });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const slide = new Audio(
        "https://cdn.pixabay.com/audio/2022/03/15/audio_e385f1aa0d.mp3"
      );
      const win = new Audio(
        "https://cdn.pixabay.com/audio/2023/04/13/audio_c18d89e292.mp3"
      );
      const click = new Audio(
        "https://cdn.pixabay.com/audio/2022/03/24/audio_719bb3b0e5.mp3"
      );

      slide.volume = 0.5;
      win.volume = 0.7;
      click.volume = 0.3;

      setAudioFiles({ slide, win, click });

      const savedMute = localStorage.getItem("soundMuted") === "true";
      setIsMuted(savedMute);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("soundMuted", String(isMuted));
  }, [isMuted]);

  const playSound = useCallback(
    (soundType: "slide" | "win" | "click") => {
      if (!isMuted && audioFiles[soundType]) {
        audioFiles[soundType]!.currentTime = 0;
        audioFiles[soundType]!.play().catch(() => {});
      }
    },
    [audioFiles, isMuted]
  );

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const availableImages: ImageOption[] = [
    {
      src: "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "Forest",
    },
    {
      src: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "Anime",
    },
    {
      src: "https://images.unsplash.com/photo-1641302109095-da46fffa3d75?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "Character",
    },
    {
      src: "https://images.unsplash.com/photo-1616097970275-1e187b4ce59f?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "Adventure",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "Mountain",
    },
    {
      src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "Lake",
    },
    {
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "Sunset",
    },
    {
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&h=800&fit=crop&crop=entropy",
      name: "River",
    },
  ];

  const mockHighScores: Score[] = [
    { moves: 45, time: 120, gridSize: 3, date: "2025-05-22T10:30:00.000Z" },
    { moves: 52, time: 95, gridSize: 3, date: "2025-05-21T14:20:00.000Z" },
    { moves: 89, time: 245, gridSize: 4, date: "2025-05-20T16:45:00.000Z" },
    { moves: 67, time: 180, gridSize: 3, date: "2025-05-19T11:15:00.000Z" },
    { moves: 134, time: 420, gridSize: 4, date: "2025-05-18T13:30:00.000Z" },
    { moves: 98, time: 300, gridSize: 4, date: "2025-05-17T09:45:00.000Z" },
    { moves: 156, time: 520, gridSize: 5, date: "2025-05-16T15:20:00.000Z" },
    { moves: 78, time: 210, gridSize: 3, date: "2025-05-15T12:10:00.000Z" },
    { moves: 201, time: 680, gridSize: 5, date: "2025-05-14T17:30:00.000Z" },
    { moves: 112, time: 350, gridSize: 4, date: "2025-05-13T10:45:00.000Z" },
  ];

  const handleImageLoad = (success: boolean) => {
    setImageLoaded(success);
    if (success && !isInitialized) {
      initGame(true);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);

    const savedScores = localStorage.getItem("puzzleHighScores");
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    } else {
      setHighScores(mockHighScores);
      localStorage.setItem("puzzleHighScores", JSON.stringify(mockHighScores));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    setIsInitialized(false);
  }, [gridSize, selectedImage]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    if (tiles.length === 0) return;

    const isWon = tiles.every((tile, index) => {
      const expectedValue = index === tiles.length - 1 ? null : index + 1;
      return tile === expectedValue;
    });

    if (isWon && isRunning && moves > 0) {
      setIsRunning(false);
      setGameWon(true);
      playSound("win");

      const newScore: Score = {
        moves,
        time,
        gridSize,
        date: new Date().toISOString(),
      };
      const updatedScores = [...highScores, newScore]
        .sort((a, b) => a.moves - b.moves)
        .slice(0, 15);

      setHighScores(updatedScores);
      localStorage.setItem("puzzleHighScores", JSON.stringify(updatedScores));
    }
  }, [
    tiles,
    isRunning,
    moves,
    emptyIndex,
    highScores,
    time,
    gridSize,
    playSound,
  ]);

  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  const generateTileSet = (
    size: number,
    doShuffling: boolean
  ): (number | null)[] => {
    const orderedTiles: (number | null)[] = Array.from(
      { length: size * size - 1 },
      (_, i) => i + 1
    );

    orderedTiles.push(null);

    if (!doShuffling) {
      return orderedTiles;
    }

    const shuffledNumbers: number[] = Array.from(
      { length: size * size - 1 },
      (_, i) => i + 1
    );

    let isSolvable = false;
    do {
      shuffleArray(shuffledNumbers);
      isSolvable = checkIfSolvable(shuffledNumbers, size);
    } while (!isSolvable);

    const shuffledTiles: (number | null)[] = [...shuffledNumbers, null];

    return shuffledTiles;
  };

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const checkIfSolvable = (tiles: number[], size: number): boolean => {
    let inversions = 0;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }

    if (size % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      const emptyRowFromBottom = 1;
      return (inversions + emptyRowFromBottom) % 2 === 1;
    }
  };

  const initGame = (forceShuffling = false) => {
    const doShuffling = forceShuffling || moves > 0 || tiles.length === 0;
    const newTiles = generateTileSet(gridSize, doShuffling);

    const emptyTileIndex = newTiles.findIndex((tile) => tile === null);

    setTiles(newTiles);
    setEmptyIndex(emptyTileIndex);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setGameWon(false);
  };

  const handleTileClick = (index: number) => {
    if (!isRunning && !gameWon) {
      setIsRunning(true);
    }

    if (canMoveTile(index)) {
      playSound("slide");
      const newTiles = [...tiles];
      newTiles[emptyIndex] = tiles[index];
      newTiles[index] = null;

      setTiles(newTiles);
      setEmptyIndex(index);
      setMoves(moves + 1);
    }
  };

  const canMoveTile = (index: number): boolean => {
    if (tiles[index] === null) return false;

    const tileRow = Math.floor(index / gridSize);
    const tileCol = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    return (
      (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
      (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1)
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleCloseScoreboard = () => setShowScoreboard(false);
  const handleCloseInfo = () => setShowInfo(false);
  const handleCloseGameWon = () => setGameWon(false);

  const handlePlayAgain = () => {
    setGameWon(false);
    initGame(true);
  };

  const handleViewScores = () => {
    setGameWon(false);
    setShowScoreboard(true);
  };

  return (
    <div
      className={`${
        poppins.className
      } min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onComplete={() => setShowSplash(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col">
        <GameHeader
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          showScoreboard={() => setShowScoreboard(true)}
          showInfo={() => setShowInfo(true)}
          showSettings={() => setShowSettings(true)}
          moves={moves}
          time={time}
          formatTime={formatTime}
          isMuted={isMuted}
          toggleMute={toggleMute}
          playSound={playSound}
        />

        <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-4 md:py-8">
          <ImageContainer
            gridSize={gridSize}
            imageSrc={selectedImage}
            onLoad={handleImageLoad}
          />

          <div className="w-full max-w-2xl">
            <div
              className={`${
                isDarkMode
                  ? "bg-slate-800/60 border-slate-600/50"
                  : "bg-white/60 border-gray-200/50"
              } backdrop-blur-lg border rounded-3xl shadow-2xl p-4 md:p-8`}
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-2xl ${
                  isDarkMode ? "bg-slate-700/50" : "bg-gray-100/50"
                }`}
              >
                {!imageLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p
                        className={`text-sm md:text-lg font-medium ${
                          isDarkMode ? "text-slate-300" : "text-gray-600"
                        }`}
                      >
                        Loading image...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative grid h-full w-full"
                    style={{
                      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                      gap: "4px",
                    }}
                  >
                    {tiles.map((tileValue, index) => (
                      <div
                        key={`tile-${index}-${tileValue}`}
                        className="relative"
                      >
                        <Tile
                          index={index}
                          tileValue={tileValue}
                          gridSize={gridSize}
                          imageSrc={selectedImage}
                          onClick={handleTileClick}
                          canMove={canMoveTile(index)}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-4 md:py-6 px-4">
          <p
            className={`text-xs md:text-sm ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            © {new Date().getFullYear()} PuzzleSlide - Challenge your mind, one
            slide at a time!
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showScoreboard && (
          <ScoreboardModal
            key="scoreboard-modal"
            isOpen={showScoreboard}
            onClose={handleCloseScoreboard}
            highScores={highScores}
            isDarkMode={isDarkMode}
            formatTime={formatTime}
          />
        )}
        {showInfo && (
          <InfoModal
            key="info-modal"
            isOpen={showInfo}
            onClose={handleCloseInfo}
            isDarkMode={isDarkMode}
            playSound={playSound}
          />
        )}
        {gameWon && (
          <GameWonModal
            key="game-won-modal"
            isOpen={gameWon}
            onClose={handleCloseGameWon}
            moves={moves}
            time={time}
            gridSize={gridSize}
            isDarkMode={isDarkMode}
            formatTime={formatTime}
            onPlayAgain={handlePlayAgain}
            onViewScores={handleViewScores}
          />
        )}
        {showSettings && (
          <SettingsPanel
            key="settings-panel"
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            isDarkMode={isDarkMode}
            gridSize={gridSize}
            setGridSize={setGridSize}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            availableImages={availableImages}
            imageLoaded={imageLoaded}
            initGame={initGame}
            playSound={playSound}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
