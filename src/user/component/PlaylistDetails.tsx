import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../shared/context/PlayerContext';
import { getPlaylistDetails, updatePlaylist, deletePlaylist, removeSongFromPlaylist } from '../../api/playlistApi';
import { getLikedSongs, likeSong, getSavedSongs, saveSong } from '../../api/musicApi';
import { toast } from 'react-toastify';

// MUI Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { Dialog, DialogTitle, DialogContent, Button, TextField, IconButton } from '@mui/material';

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  // Playlist data states
  const [playlist, setPlaylist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit details states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [updating, setUpdating] = useState(false);

  // Interaction collections
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [savedSongIds, setSavedSongIds] = useState<string[]>([]);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getPlaylistDetails(id);
      if (res.playlist) {
        setPlaylist(res.playlist);
        setSongs(res.playlist.songs || []);
        
        // Prep edit fields
        setName(res.playlist.name);
        setDescription(res.playlist.description);
        setCoverImage(res.playlist.coverImage);
      }
    } catch (err) {
      console.error('Error fetching playlist details:', err);
      toast.error('Failed to load playlist details');
      navigate('/playlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Load liked/saved state
  useEffect(() => {
    const loadInteractions = async () => {
      try {
        const [likesRes, savesRes] = await Promise.all([
          getLikedSongs().catch(() => ({ results: [] })),
          getSavedSongs().catch(() => ({ results: [] }))
        ]);
        setLikedSongIds((likesRes.results || []).map((s: any) => s.id));
        setSavedSongIds((savesRes.results || []).map((s: any) => s.id));
      } catch (err) {
        console.error('Error loading interaction statuses:', err);
      }
    };
    loadInteractions();
  }, []);

  // Handle Cover Art File Upload -> Convert to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Edit metadata Changes
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name.trim()) return;

    try {
      setUpdating(true);
      await updatePlaylist(id, {
        name: name.trim(),
        description: description.trim(),
        coverImage
      });
      toast.success('Playlist updated successfully');
      setOpenEditModal(false);
      fetchDetails();
    } catch (err) {
      toast.error('Failed to update playlist');
    } finally {
      setUpdating(false);
    }
  };

  // Delete entire playlist
  const handleDeletePlaylist = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this playlist? This action is permanent.')) return;

    try {
      await deletePlaylist(id);
      toast.success('Playlist deleted');
      navigate('/playlist');
    } catch (err) {
      toast.error('Failed to delete playlist');
    }
  };

  // Remove single song row from playlist
  const handleRemoveSong = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (!id) return;

    try {
      await removeSongFromPlaylist(id, songId);
      toast.info('Song removed from playlist');
      fetchDetails();
    } catch (err) {
      toast.error('Failed to remove song');
    }
  };

  // Play whole list
  const handlePlayPlaylist = () => {
    if (songs.length === 0) {
      toast.info('Playlist is empty!');
      return;
    }
    playTrack(songs[0], songs);
  };

  // Play single song from row
  const handlePlaySongRow = (song: any) => {
    playTrack(song, songs);
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

  const isPlayingSong = (songId: string) => {
    return currentTrack?.id === songId && isPlaying;
  };

  const isPlaylistPlaying = () => {
    if (!currentTrack || !isPlaying) return false;
    return songs.some((s: any) => s.id === currentTrack.id);
  };

  const formatDuration = (secs: number) => {
    if (!secs) return '3:30';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-neutral-400 select-none">
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-[#1DB954] rounded-full mb-4" />
        <span>Loading playlist...</span>
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="space-y-10 text-white select-none relative">
      
      {/* 1. PLAYLIST HERO DETAIL BANNER */}
      <div className="relative w-full h-[280px] md:h-[320px] -mt-6 -mx-6 bg-gradient-to-b from-neutral-800 to-neutral-950 overflow-hidden flex items-end p-8 md:p-12 border-b border-neutral-900">
        <div className="absolute inset-0 bg-[#0F0F0F]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
        
        <div className="z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-8">
          <img
            src={playlist.coverImage || '/music_cover.png'}
            alt={playlist.name}
            className="w-32 h-32 md:w-44 md:h-44 object-cover rounded shadow-2xl border border-neutral-800 shrink-0"
          />
          <div className="text-center sm:text-left flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Playlist</span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
              {playlist.name}
            </h1>
            <p className="text-sm text-[#B3B3B3] mb-2 font-medium">
              {playlist.description || 'No description provided'}
            </p>
            <p className="text-xs text-[#B3B3B3]">
              Created by <span className="text-white font-semibold">{playlist.creator?.name || 'User'}</span> • {songs.length} {songs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. CORE CONTROLS ROW */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          {songs.length > 0 && (
            <button
              onClick={handlePlayPlaylist}
              className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 transition-all shadow-xl active:scale-95 shrink-0"
            >
              {isPlaylistPlaying() ? (
                <PauseIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </button>
          )}

          {/* Edit Button */}
          <button
            onClick={() => setOpenEditModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-neutral-700 text-[#B3B3B3] hover:text-white hover:border-neutral-500 text-xs font-extrabold tracking-wider uppercase transition-colors"
          >
            <EditIcon sx={{ fontSize: 16 }} />
            <span>Edit Info</span>
          </button>
        </div>

        {/* Delete Playlist button */}
        <button
          onClick={handleDeletePlaylist}
          className="flex items-center gap-1 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
          <span>Delete Playlist</span>
        </button>
      </div>

      {/* 3. SONGS LIST TABLE */}
      <div className="max-w-7xl mx-auto">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/10 border border-neutral-900 rounded-lg p-6 text-center space-y-4">
            <LibraryMusicIcon sx={{ fontSize: 48 }} className="text-neutral-700" />
            <h4 className="font-bold text-neutral-400">This playlist is empty</h4>
            <p className="text-xs text-[#B3B3B3] max-w-sm">Find tracks on the Home page or Search screen, click the options icon, and choose this playlist to add them.</p>
            <button
              onClick={() => navigate('/search')}
              className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-bold text-xs"
            >
              Find Music
            </button>
          </div>
        ) : (
          <div className="flex flex-col border border-neutral-900 bg-neutral-900/10 rounded-lg overflow-hidden">
            {songs.map((song, idx) => {
              const liked = likedSongIds.includes(song.id);
              const saved = savedSongIds.includes(song.id);
              const isCurrent = currentTrack?.id === song.id;
              
              return (
                <div
                  key={song.id + '-' + idx}
                  className="group flex items-center justify-between p-3 hover:bg-neutral-900/60 transition-colors border-b border-neutral-900/20 last:border-0"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Index or Hover Play */}
                    <div className="w-6 text-center text-sm font-semibold text-neutral-500 shrink-0">
                      <span className="group-hover:hidden">{idx + 1}</span>
                      <button
                        onClick={() => handlePlaySongRow(song)}
                        className="hidden group-hover:inline-block text-white hover:text-[#1DB954]"
                      >
                        {isPlayingSong(song.id) ? (
                          <PauseIcon fontSize="small" />
                        ) : (
                          <PlayArrowIcon fontSize="small" />
                        )}
                      </button>
                    </div>

                    <img
                      src={song.album_image || '/music_cover.png'}
                      alt={song.name}
                      className="w-10 h-10 object-cover rounded shrink-0 border border-neutral-800"
                    />

                    <div className="truncate pr-4">
                      <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                        {song.name}
                      </h4>
                      <p className="text-xs text-[#B3B3B3] truncate">{song.artist_name}</p>
                    </div>
                  </div>

                  {/* Right Side Controls */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconButton onClick={() => handleLikeToggle(song)} size="small" className="text-white">
                        {liked ? <FavoriteIcon fontSize="small" className="text-[#1DB954]" /> : <FavoriteBorderIcon fontSize="small" className="text-neutral-500" />}
                      </IconButton>
                      <IconButton onClick={() => handleSaveToggle(song)} size="small" className="text-white">
                        {saved ? <BookmarkIcon fontSize="small" className="text-[#1DB954]" /> : <BookmarkBorderIcon fontSize="small" className="text-neutral-500" />}
                      </IconButton>
                      <IconButton onClick={(e) => handleRemoveSong(e, song.id)} size="small" className="text-red-500 hover:text-red-400">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                    <span className="text-xs text-neutral-500 font-semibold w-10 text-right">
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT PLAYLIST MODAL DIALOG */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        PaperProps={{
          sx: {
            bgcolor: '#181818',
            color: '#FFFFFF',
            border: '1px solid #282828',
            borderRadius: '12px',
            width: '100%',
            maxWidth: 450,
          },
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b border-[#282828] !p-4">
          <span className="font-extrabold text-lg">Edit Details</span>
          <IconButton onClick={() => setOpenEditModal(false)} className="text-white hover:bg-neutral-800">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="!p-6">
          <form onSubmit={handleEditSubmit} className="space-y-6">
            
            {/* Cover Upload */}
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="cover-edit-upload" className="cursor-pointer">
                <div className="w-36 h-36 border border-neutral-800 hover:border-[#1DB954] rounded-md overflow-hidden bg-neutral-900 flex items-center justify-center shadow-lg relative group transition-colors">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt="Playlist Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <LibraryMusicIcon sx={{ fontSize: 40 }} className="text-neutral-600 mb-1" />
                      <p className="text-[10px] text-neutral-500 uppercase font-bold">Upload Cover</p>
                    </div>
                  )}
                </div>
              </label>
              <input
                id="cover-edit-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <TextField
                fullWidth
                label="Playlist Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                required
                InputLabelProps={{ style: { color: '#B3B3B3' } }}
                inputProps={{ style: { color: '#FFFFFF' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#282828' },
                    '&:hover fieldset': { borderColor: '#535353' },
                    '&.Mui-focused fieldset': { borderColor: '#1DB954' },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{ style: { color: '#B3B3B3' } }}
                inputProps={{ style: { color: '#FFFFFF' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#282828' },
                    '&:hover fieldset': { borderColor: '#535353' },
                    '&.Mui-focused fieldset': { borderColor: '#1DB954' },
                  },
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <Button
                fullWidth
                onClick={() => setOpenEditModal(false)}
                sx={{ color: '#FFFFFF', border: '1px solid #282828', py: 1.2, textTransform: 'none', fontWeight: 'bold' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={updating}
                sx={{
                  bgcolor: '#1DB954',
                  color: '#000000',
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#1ed760' },
                }}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PlaylistDetails;
