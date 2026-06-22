import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../shared/context/PlayerContext';
import { getLikedSongs, likeSong, unlikeSong, getSavedSongs, saveSong, unsaveSong } from '../../api/musicApi';
import { toast } from 'react-toastify';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import NotesIcon from '@mui/icons-material/Notes';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Slider, IconButton, Menu, MenuItem } from '@mui/material';

const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    queue,
    currentIndex,
    shuffle,
    repeat,
    showLyrics,
    setShowLyrics,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [queueAnchorEl, setQueueAnchorEl] = useState<null | HTMLElement>(null);

  // Load user liked and saved songs to check status
  useEffect(() => {
    if (!currentTrack) return;

    const checkStatus = async () => {
      try {
        const [likesRes, savesRes] = await Promise.all([
          getLikedSongs(),
          getSavedSongs()
        ]);

        const likes = likesRes.results || [];
        const saves = savesRes.results || [];

        setIsLiked(likes.some((s: any) => s.id === currentTrack.id));
        setIsSaved(saves.some((s: any) => s.id === currentTrack.id));
      } catch (err) {
        console.error('Error checking song status:', err);
      }
    };
    checkStatus();
  }, [currentTrack]);

  if (!currentTrack) return null;

  // Toggle Like Song
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await unlikeSong(currentTrack.id);
        setIsLiked(false);
        toast.info('Removed from Liked Songs');
      } else {
        await likeSong(currentTrack);
        setIsLiked(true);
        toast.success('Added to Liked Songs');
      }
    } catch (err) {
      toast.error('Failed to update liked status');
    }
  };

  // Toggle Save Song
  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await unsaveSong(currentTrack.id);
        setIsSaved(false);
        toast.info('Removed from Saved Songs');
      } else {
        await saveSong(currentTrack);
        setIsSaved(true);
        toast.success('Added to Library');
      }
    } catch (err) {
      toast.error('Failed to update saved status');
    }
  };

  // Mute / Unmute
  const handleMuteToggle = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.5);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Queue Dropdown Menu Handlers
  const handleQueueOpen = (event: React.MouseEvent<HTMLElement>) => {
    setQueueAnchorEl(event.currentTarget);
  };
  const handleQueueClose = () => {
    setQueueAnchorEl(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#181818]/95 border-t border-[#282828] backdrop-blur-md px-4 flex items-center justify-between z-50 text-white select-none">

      {/* LEFT PANEL: Track Info */}
      <div className="flex items-center w-1/3 min-w-[180px]">
        <img
          src={currentTrack.album_image || "/music_cover.png"}
          alt={currentTrack.name}
          className="w-14 h-14 rounded-md object-cover mr-4 shadow-lg border border-[#282828]"
        />
        <div className="overflow-hidden mr-4 max-w-[120px] sm:max-w-[200px]">
          <h4 className="text-sm font-semibold truncate hover:underline cursor-pointer">
            {currentTrack.name}
          </h4>
          <p className="text-xs text-[#B3B3B3] truncate hover:underline cursor-pointer">
            {currentTrack.artist_name}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton onClick={handleLikeToggle} size="small" className="text-white hover:text-[#1DB954]">
            {isLiked ? (
              <FavoriteIcon fontSize="small" className="text-[#1DB954]" />
            ) : (
              <FavoriteBorderIcon fontSize="small" className="text-[#B3B3B3]" />
            )}
          </IconButton>
          <IconButton onClick={handleSaveToggle} size="small" className="text-white hover:text-[#1DB954]">
            {isSaved ? (
              <BookmarkIcon fontSize="small" className="text-[#1DB954]" />
            ) : (
              <BookmarkBorderIcon fontSize="small" className="text-[#B3B3B3]" />
            )}
          </IconButton>
        </div>
      </div>

      {/* CENTER PANEL: Playback Controls */}
      <div className="flex flex-col items-center w-1/3 max-w-[600px]">
        {/* Button Controls */}
        <div className="flex items-center gap-4 sm:gap-6 mb-1.5">
          <IconButton
            onClick={toggleShuffle}
            size="small"
            className={`${shuffle ? 'text-[#1DB954]' : 'text-[#B3B3B3]'} hover:text-white`}
          >
            <ShuffleIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={prevTrack} size="small" className="text-[#B3B3B3] hover:text-white">
            <SkipPreviousIcon fontSize="medium" />
          </IconButton>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-md"
          >
            {isPlaying ? (
              <PauseIcon fontSize="small" />
            ) : (
              <PlayArrowIcon fontSize="small" />
            )}
          </button>

          <IconButton onClick={nextTrack} size="small" className="text-[#B3B3B3] hover:text-white">
            <SkipNextIcon fontSize="medium" />
          </IconButton>

          <IconButton
            onClick={toggleRepeat}
            size="small"
            className={`${repeat !== 'none' ? 'text-[#1DB954]' : 'text-[#B3B3B3]'} hover:text-white`}
          >
            <RepeatIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Timeline Slider */}
        <div className="flex items-center gap-2 w-full text-xs text-[#B3B3B3]">
          <span>{formatTime(progress)}</span>
          <Slider
            size="small"
            value={progress}
            min={0}
            max={duration || 100}
            onChange={(_, val) => seek(val as number)}
            sx={{
              color: '#B3B3B3',
              padding: '13px 0',
              '& .MuiSlider-thumb': {
                width: 0,
                height: 0,
                transition: '0.1s',
                '&:before': {
                  boxShadow: 'none',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
              '&:hover': {
                color: '#1DB954',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                },
              },
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-rail': {
                opacity: 0.2,
                backgroundColor: '#B3B3B3',
              },
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT PANEL: Volume & Extras */}
      <div className="flex items-center justify-end w-1/3 gap-3 min-w-[150px]">
        {/* Lyrics Button */}
        <IconButton
          onClick={() => setShowLyrics(!showLyrics)}
          size="small"
          className={`${showLyrics ? 'text-[#1DB954]' : 'text-[#B3B3B3]'} hover:text-white`}
        >
          <NotesIcon fontSize="small" />
        </IconButton>

        {/* Queue Button */}
        <IconButton
          onClick={handleQueueOpen}
          size="small"
          className="text-[#B3B3B3] hover:text-white"
        >
          <QueueMusicIcon fontSize="small" />
        </IconButton>

        {/* Volume controls */}
        <div className="flex items-center gap-2 w-24 sm:w-28">
          <IconButton onClick={handleMuteToggle} size="small" className="text-[#B3B3B3] hover:text-white">
            {volume === 0 ? <VolumeMuteIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
          </IconButton>
          <Slider
            size="small"
            value={volume * 100}
            min={0}
            max={100}
            onChange={(_, val) => setVolume((val as number) / 100)}
            sx={{
              color: '#B3B3B3',
              '&:hover': {
                color: '#1DB954',
              },
              '& .MuiSlider-thumb': {
                width: 0,
                height: 0,
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
              '&:hover .MuiSlider-thumb': {
                width: 10,
                height: 10,
              },
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-rail': {
                opacity: 0.2,
                backgroundColor: '#B3B3B3',
              },
            }}
          />
        </div>
      </div>

      {/* QUEUE MENU LIST POPUP */}
      <Menu
        anchorEl={queueAnchorEl}
        open={Boolean(queueAnchorEl)}
        onClose={handleQueueClose}
        PaperProps={{
          sx: {
            bgcolor: '#181818',
            color: '#FFFFFF',
            border: '1px solid #282828',
            maxHeight: 300,
            width: 280,
            marginTop: -6,
            borderRadius: '8px',
          },
        }}
      >
        <div className="p-3 border-b border-[#282828]">
          <h5 className="font-semibold text-xs text-[#B3B3B3] uppercase tracking-wider">Play Queue</h5>
        </div>
        {queue.length === 0 ? (
          <MenuItem disabled className="text-xs italic text-[#B3B3B3]">Queue is empty</MenuItem>
        ) : (
          queue.map((track, idx) => (
            <MenuItem
              key={track.id + '-' + idx}
              onClick={() => {
                usePlayer().playTrack(track, queue);
                handleQueueClose();
              }}
              sx={{
                fontSize: '13px',
                py: 1,
                bgcolor: idx === currentIndex ? 'rgba(29, 185, 84, 0.15)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <div className="flex items-center w-full justify-between overflow-hidden">
                <span className={`truncate w-[80%] ${idx === currentIndex ? 'text-[#1DB954] font-medium' : 'text-white'}`}>
                  {track.name}
                </span>
                <span className="text-[10px] text-[#B3B3B3] shrink-0">
                  {track.artist_name.slice(0, 10)}
                </span>
              </div>
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
};

export default PlayerBar;
