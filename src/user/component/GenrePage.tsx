import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../shared/context/PlayerContext';
import { getGenreDetails, getLikedSongs, likeSong, getSavedSongs, saveSong } from '../../api/musicApi';
import { getPlaylists, addSongToPlaylist } from '../../api/playlistApi';
import { toast } from 'react-toastify';

// MUI Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Menu, MenuItem, IconButton } from '@mui/material';

const GenrePage: React.FC = () => {
  const { genreName } = useParams<{ genreName: string }>();
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  // Genre content states
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction collections
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [savedSongIds, setSavedSongIds] = useState<string[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);

  // Playlist menu triggers
  const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSongToAddToPlaylist, setSelectedSongToAddToPlaylist] = useState<any>(null);

  // Determine a colorful gradient based on genre name
  const getGradient = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('pop')) return 'from-pink-500 to-purple-800';
    if (lower.includes('rock')) return 'from-red-600 to-orange-700';
    if (lower.includes('hip')) return 'from-green-500 to-blue-800';
    if (lower.includes('edm')) return 'from-cyan-400 to-blue-700';
    if (lower.includes('class')) return 'from-amber-600 to-yellow-800';
    if (lower.includes('bolly')) return 'from-fuchsia-600 to-pink-800';
    if (lower.includes('holly')) return 'from-teal-600 to-green-800';
    if (lower.includes('punj')) return 'from-rose-500 to-red-800';
    if (lower.includes('lofi')) return 'from-indigo-600 to-purple-850';
    return 'from-violet-600 to-indigo-900';
  };

  useEffect(() => {
    if (!genreName) return;

    const loadGenreData = async () => {
      try {
        setLoading(true);
        const [detailsRes, likesRes, savesRes, playlistsRes] = await Promise.all([
          getGenreDetails(genreName),
          getLikedSongs().catch(() => ({ results: [] })),
          getSavedSongs().catch(() => ({ results: [] })),
          getPlaylists().catch(() => ({ results: [] }))
        ]);

        setTracks(detailsRes.tracks || []);
        setArtists(detailsRes.artists || []);
        setLikedSongIds((likesRes.results || []).map((s: any) => s.id));
        setSavedSongIds((savesRes.results || []).map((s: any) => s.id));
        setUserPlaylists(playlistsRes.results || []);
      } catch (err) {
        console.error('Failed to load genre data:', err);
        toast.error(`Could not load genre ${genreName}`);
      } finally {
        setLoading(false);
      }
    };

    loadGenreData();
  }, [genreName]);

  // Play song handler
  const handlePlaySong = (song: any) => {
    const formattedTrack = {
      id: song.id,
      name: song.name,
      artist_name: song.artist_name,
      audio: song.audio,
      album_image: song.album_image || '/music_cover.png',
    };
    const formattedQueue = tracks.map(t => ({
      id: t.id,
      name: t.name,
      artist_name: t.artist_name,
      audio: t.audio,
      album_image: t.album_image || '/music_cover.png',
    }));
    playTrack(formattedTrack, formattedQueue);
  };

  // Liked toggler
  const handleLikeToggle = async (song: any) => {
    const isLiked = likedSongIds.includes(song.id);
    try {
      if (isLiked) {
        await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/music/like/${song.id}`,
          { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setLikedSongIds(prev => prev.filter(id => id !== song.id));
        toast.info('Removed from Liked Songs');
      } else {
        await likeSong(song);
        setLikedSongIds(prev => [...prev, song.id]);
        toast.success('Added to Liked Songs');
      }
    } catch (err) {
      toast.error('Failed to update liked state');
    }
  };

  // Saved library toggler
  const handleSaveToggle = async (song: any) => {
    const isSaved = savedSongIds.includes(song.id);
    try {
      if (isSaved) {
        await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/music/save/${song.id}`,
          { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setSavedSongIds(prev => prev.filter(id => id !== song.id));
        toast.info('Removed from Library');
      } else {
        await saveSong(song);
        setSavedSongIds(prev => [...prev, song.id]);
        toast.success('Saved to Library');
      }
    } catch (err) {
      toast.error('Failed to update saved state');
    }
  };

  // Playlist menu triggers
  const handlePlaylistMenuOpen = (event: React.MouseEvent<HTMLElement>, song: any) => {
    setPlaylistMenuAnchor(event.currentTarget);
    setSelectedSongToAddToPlaylist(song);
  };

  const handlePlaylistSelect = async (playlistId: string) => {
    if (!selectedSongToAddToPlaylist) return;
    try {
      await addSongToPlaylist(playlistId, selectedSongToAddToPlaylist);
      toast.success('Added to Playlist');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to add song';
      if (err.response?.status === 409) {
        toast.warning('Song is already in this playlist');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setPlaylistMenuAnchor(null);
      setSelectedSongToAddToPlaylist(null);
    }
  };

  const isPlayingSong = (songId: string) => {
    return currentTrack?.id === songId && isPlaying;
  };

  const formatDuration = (secs: number) => {
    if (!secs) return '3:12';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-neutral-400 select-none">
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-[#1DB954] rounded-full mb-4" />
        <span>Loading genre tracks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-white select-none relative">
      
      {/* 1. GENRE HERO BANNER */}
      <div className={`relative w-full h-[240px] md:h-[280px] -mt-6 -mx-6 bg-gradient-to-b ${getGradient(genreName)} overflow-hidden flex items-end p-8 md:p-12 border-b border-neutral-900`}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
        
        <div className="z-10 max-w-7xl mx-auto w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-1 block">Genre Details</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight capitalize">
            {genreName}
          </h1>
        </div>
      </div>

      {/* 2. CORE CONTROLS ROW */}
      <div className="flex items-center gap-6 max-w-7xl mx-auto">
        {tracks.length > 0 && (
          <button
            onClick={() => handlePlaySong(tracks[0])}
            className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 transition-all shadow-xl active:scale-95 shrink-0"
          >
            {isPlayingSong(tracks[0].id) ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </button>
        )}
      </div>

      {/* 3. TRACKS LIST */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Top Hits</h2>
        {tracks.length === 0 ? (
          <p className="text-neutral-500 italic text-sm">No songs available for this genre tag.</p>
        ) : (
          <div className="flex flex-col border border-neutral-900 bg-neutral-900/10 rounded-lg overflow-hidden">
            {tracks.map((track, idx) => {
              const liked = likedSongIds.includes(track.id);
              const saved = savedSongIds.includes(track.id);
              const isCurrent = currentTrack?.id === track.id;
              
              return (
                <div
                  key={track.id + '-' + idx}
                  className="group flex items-center justify-between p-3 hover:bg-neutral-900/60 transition-colors border-b border-neutral-900/20 last:border-0"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Index or Hover Play */}
                    <div className="w-6 text-center text-sm font-semibold text-neutral-500 shrink-0">
                      <span className="group-hover:hidden">{idx + 1}</span>
                      <button
                        onClick={() => handlePlaySong(track)}
                        className="hidden group-hover:inline-block text-white hover:text-[#1DB954]"
                      >
                        {isPlayingSong(track.id) ? (
                          <PauseIcon fontSize="small" />
                        ) : (
                          <PlayArrowIcon fontSize="small" />
                        )}
                      </button>
                    </div>

                    <img
                      src={track.album_image || '/music_cover.png'}
                      alt={track.name}
                      className="w-10 h-10 object-cover rounded shrink-0 border border-neutral-800"
                    />

                    <div className="truncate pr-4">
                      <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                        {track.name}
                      </h4>
                      <p className="text-xs text-[#B3B3B3] truncate">{track.artist_name}</p>
                    </div>
                  </div>

                  {/* Right Side: Duration & Options */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconButton onClick={() => handleLikeToggle(track)} size="small" className="text-white">
                        {liked ? <FavoriteIcon fontSize="small" className="text-[#1DB954]" /> : <FavoriteBorderIcon fontSize="small" className="text-neutral-500" />}
                      </IconButton>
                      <IconButton onClick={() => handleSaveToggle(track)} size="small" className="text-white">
                        {saved ? <BookmarkIcon fontSize="small" className="text-[#1DB954]" /> : <BookmarkBorderIcon fontSize="small" className="text-neutral-500" />}
                      </IconButton>
                      <IconButton onClick={(e) => handlePlaylistMenuOpen(e, track)} size="small" className="text-white">
                        <PlaylistAddIcon fontSize="small" className="text-neutral-500" />
                      </IconButton>
                    </div>
                    <span className="text-xs text-neutral-500 font-semibold w-10 text-right">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. GENRE ARTISTS */}
      {artists.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Popular Genre Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {artists.map((artist, idx) => (
              <div
                key={artist.id + '-' + idx}
                onClick={() => navigate(`/artist/${artist.id}`)}
                className="group bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer text-center"
              >
                <div className="aspect-square w-full rounded-full overflow-hidden mb-4 shadow-lg">
                  <img
                    src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-sm font-bold truncate">{artist.name}</h4>
                <p className="text-xs text-neutral-500 mt-1">Artist</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD TO PLAYLIST DROPDOWN */}
      <Menu
        anchorEl={playlistMenuAnchor}
        open={Boolean(playlistMenuAnchor)}
        onClose={() => setPlaylistMenuAnchor(null)}
        PaperProps={{
          sx: {
            bgcolor: '#181818',
            color: '#FFFFFF',
            border: '1px solid #282828',
            borderRadius: '8px',
          },
        }}
      >
        <div className="px-4 py-2 border-b border-[#282828]">
          <h5 className="font-bold text-xs text-[#B3B3B3] uppercase">Add to playlist</h5>
        </div>
        {userPlaylists.length === 0 ? (
          <MenuItem disabled className="text-xs italic text-[#B3B3B3]">
            No playlists found. Create one first!
          </MenuItem>
        ) : (
          userPlaylists.map((p) => (
            <MenuItem
              key={p._id}
              onClick={() => handlePlaylistSelect(p._id)}
              sx={{
                fontSize: '13px',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              {p.name}
            </MenuItem>
          ))
        )}
      </Menu>

    </div>
  );
};

export default GenrePage;
