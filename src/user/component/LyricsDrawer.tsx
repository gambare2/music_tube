import React, { useEffect, useState, useRef } from 'react';
import { usePlayer } from '../../shared/context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

interface LyricLine {
  time: number; // in seconds
  text: string;
}

const LyricsDrawer: React.FC = () => {
  const { showLyrics, setShowLyrics, lyrics, progress, currentTrack } = usePlayer();
  const [parsedLyrics, setParsedLyrics] = useState<LyricLine[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync scroll of the lyrics container
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  // Parse lyrics when lyrics text changes
  useEffect(() => {
    if (!lyrics) {
      setParsedLyrics([]);
      return;
    }

    const lines = lyrics.split('\n');
    const tempParsed: LyricLine[] = [];
    const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2})\]/;

    lines.forEach(line => {
      const match = timeRegExp.exec(line);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseInt(match[3], 10);
        const timeInSeconds = minutes * 60 + seconds + milliseconds / 100;
        const text = line.replace(timeRegExp, '').trim();
        tempParsed.push({ time: timeInSeconds, text });
      } else {
        // Line without timestamp
        const trimmed = line.trim();
        if (trimmed) {
          tempParsed.push({ time: -1, text: trimmed });
        }
      }
    });

    // Sort by timestamp
    tempParsed.sort((a, b) => a.time - b.time);
    setParsedLyrics(tempParsed);
  }, [lyrics]);

  // Sync active lyric line with audio progress
  useEffect(() => {
    if (parsedLyrics.length === 0) return;

    // Find the current active line
    let foundIndex = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (parsedLyrics[i].time !== -1 && progress >= parsedLyrics[i].time) {
        foundIndex = i;
      }
    }
    setActiveIndex(foundIndex);
  }, [progress, parsedLyrics]);

  return (
    <AnimatePresence>
      {showLyrics && currentTrack && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-24 w-full md:w-[450px] bg-black/90 border-l border-[#282828] backdrop-blur-xl z-40 text-white flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#282828] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentTrack.album_image || "/music_cover.png"}
                alt={currentTrack.name}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold truncate max-w-[200px]">{currentTrack.name}</h3>
                <p className="text-xs text-[#B3B3B3] truncate max-w-[200px]">{currentTrack.artist_name}</p>
              </div>
            </div>
            <IconButton onClick={() => setShowLyrics(false)} className="text-white hover:bg-neutral-800">
              <CloseIcon />
            </IconButton>
          </div>

          {/* Scrolling Lyrics Container */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto no-scrollbar py-20 px-8 flex flex-col gap-6 text-center select-none"
          >
            {parsedLyrics.length === 0 ? (
              <div className="text-neutral-500 italic text-sm mt-10">Lyrics not available for this track.</div>
            ) : (
              parsedLyrics.map((line, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    className={`transition-all duration-300 text-lg md:text-xl font-semibold px-2 py-1.5 rounded-lg ${
                      isActive
                        ? 'text-[#1DB954] scale-105 font-bold drop-shadow-[0_0_8px_rgba(29,185,84,0.3)]'
                        : 'text-neutral-400 opacity-60 hover:opacity-90 hover:text-white'
                    }`}
                  >
                    {line.text}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer branding */}
          <div className="p-3 text-center text-[10px] text-[#B3B3B3] border-t border-[#282828]/50 bg-black/40">
            Synced Lyrics Provided by PriTube Integration
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LyricsDrawer;
