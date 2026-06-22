import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { addHistory } from '../../api/musicApi';

export type Track = {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  album_image: string;
  duration?: number;
};

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0 to 1
  queue: Track[];
  history: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
  showLyrics: boolean;
  lyrics: string;
  setShowLyrics: (show: boolean) => void;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('player_volume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const progressTimerRef = useRef<number | null>(null);
  const historyLoggedRef = useRef<boolean>(false);
  const playTimeRef = useRef<number>(0);

  // Initialize Audio Object
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    // Synchronize HTML5 Audio Events
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setProgress(audio.currentTime);

      // Calculate play duration to log history
      if (isPlaying) {
        playTimeRef.current += 0.25; // approximated time slice
        if (playTimeRef.current >= 10 && !historyLoggedRef.current && currentTrack) {
          historyLoggedRef.current = true;
          // Silently log history in database
          addHistory(currentTrack).catch(err => console.error('History log failed', err));
        }
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const onEnded = () => {
      handleTrackEnded();
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]);

  // Synchronize dynamic volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem('player_volume', volume.toString());
    }
  }, [volume]);

  // Synchronize playing state with audio ref
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Audio autoplay prevented:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Set audio source when currentTrack changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audio;
      setProgress(0);
      setDuration(0);
      historyLoggedRef.current = false;
      playTimeRef.current = 0;

      // Generate mock lyrics based on track metadata
      generateLyrics(currentTrack);

      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Audio source change play prevented:', err));
      }
    }
  }, [currentTrack]);

  // Helper: Mock Lyrics Generation
  const generateLyrics = (track: Track) => {
    const defaultLyrics = `
[00:00.00] Enjoy streaming "${track.name}"
[00:05.00] By ${track.artist_name}
[00:10.00] ♫ (Musical Intro) ♫
[00:20.00] This is a preview of the premium dark theme player lyrics
[00:25.00] MusicTube gives you the ultimate audio experience
[00:30.00] High fidelity audio streaming is now active
[00:35.00] Powered by Jamendo API and MongoDB backend
[00:40.00] ♫ (Synth Bridge) ♫
[00:55.00] Feel the rhythm flowing through your veins
[01:00.00] Moving to the beat, escaping all the strains
[01:10.00] Thank you for listening to "${track.name}"!
[01:15.00] ♫ (Outro Solo) ♫
    `.trim();
    setLyrics(defaultLyrics);
  };

  const handleTrackEnded = () => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
      }
    } else {
      nextTrack();
    }
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
      const index = newQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      // If song is not in queue, insert it after current index
      const existsIndex = queue.findIndex(t => t.id === track.id);
      if (existsIndex !== -1) {
        setCurrentIndex(existsIndex);
      } else {
        const updatedQueue = [...queue];
        const insertAt = currentIndex + 1;
        updatedQueue.splice(insertAt, 0, track);
        setQueue(updatedQueue);
        setCurrentIndex(insertAt);
      }
    }

    // Log previous to history if exists
    if (currentTrack) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 19)]);
    }

    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentTrack && queue.length > 0) {
      playTrack(queue[0]);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    let nextIdx = currentIndex + 1;

    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = repeat === 'all' ? 0 : -1;
    }

    if (nextIdx !== -1 && queue[nextIdx]) {
      setCurrentIndex(nextIdx);
      setCurrentTrack(queue[nextIdx]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const prevTrack = () => {
    if (queue.length === 0) return;

    let prevIdx = currentIndex - 1;

    // If played > 3 seconds, restart the song first
    if (audioRef.current && audioRef.current.currentTime > 3) {
      seek(0);
      return;
    }

    if (prevIdx < 0) {
      prevIdx = repeat === 'all' ? queue.length - 1 : 0;
    }

    if (queue[prevIdx]) {
      setCurrentIndex(prevIdx);
      setCurrentTrack(queue[prevIdx]);
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const setVolume = (vol: number) => {
    const sanitizedVolume = Math.max(0, Math.min(1, vol));
    setVolumeState(sanitizedVolume);
  };

  const addToQueue = (track: Track) => {
    if (queue.some(t => t.id === track.id)) return;
    setQueue(prev => [...prev, track]);
    if (queue.length === 0) {
      playTrack(track, [track]);
    }
  };

  const removeFromQueue = (trackId: string) => {
    setQueue(prev => prev.filter(t => t.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(-1);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeat(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        history,
        currentIndex,
        shuffle,
        repeat,
        showLyrics,
        lyrics,
        setShowLyrics,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
