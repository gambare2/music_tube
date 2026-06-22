import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../shared/context/PlayerContext';
import { getPlaylists, createPlaylist, deletePlaylist } from '../../api/playlistApi';
import { toast } from 'react-toastify';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, Button, TextField, IconButton } from '@mui/material';

const Playlists: React.FC = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  // Playlists state
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageBase64, setCoverImageBase64] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchUserPlaylists = async () => {
    try {
      setLoading(true);
      const res = await getPlaylists();
      setPlaylists(res.results || []);
    } catch (err) {
      console.error('Failed to load playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  // Handle Cover Art File Upload -> Convert to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit playlist creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Playlist name is required');
      return;
    }

    try {
      setCreating(true);
      await createPlaylist({
        name: name.trim(),
        description: description.trim(),
        coverImage: coverImageBase64,
        isPublic: false
      });
      toast.success('Playlist created successfully!');
      
      // Reset & Refresh
      setName('');
      setDescription('');
      setCoverImageBase64('');
      setOpenModal(false);
      fetchUserPlaylists();
    } catch (err) {
      toast.error('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  // Delete Playlist
  const handleDeletePlaylist = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent card click navigation
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    
    try {
      await deletePlaylist(id);
      toast.success('Playlist deleted');
      fetchUserPlaylists();
    } catch (err) {
      toast.error('Failed to delete playlist');
    }
  };

  // Play whole playlist from card
  const handlePlayPlaylist = (e: React.MouseEvent, playlist: any) => {
    e.stopPropagation();
    if (!playlist.songs || playlist.songs.length === 0) {
      toast.info('Playlist is empty. Add songs first!');
      return;
    }
    
    playTrack(playlist.songs[0], playlist.songs);
  };

  const isPlaylistPlaying = (playlist: any) => {
    if (!currentTrack || !isPlaying) return false;
    return playlist.songs?.some((s: any) => s.id === currentTrack.id) || false;
  };

  return (
    <div className="space-y-8 text-white select-none">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Playlists</h1>
          <p className="text-sm text-[#B3B3B3]">Create and curate your custom audio collections.</p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md text-sm uppercase tracking-wider"
        >
          <AddIcon />
          <span>New Playlist</span>
        </button>
      </div>

      {/* PLAYLISTS LISTING */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-[#1DB954] rounded-full mr-3" />
          <span>Fetching playlists...</span>
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-neutral-800 bg-neutral-900/10 rounded-xl p-8 text-center space-y-4">
          <LibraryMusicIcon sx={{ fontSize: 60 }} className="text-neutral-600" />
          <h3 className="text-lg font-bold text-neutral-400">Create your first playlist</h3>
          <p className="text-xs text-[#B3B3B3] max-w-sm">Curating lists is simple. Just press the button above, name it, and start adding your favorite music rows.</p>
          <button
            onClick={() => setOpenModal(true)}
            className="px-6 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full text-xs uppercase"
          >
            Create Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((playlist) => {
            const hasSongs = playlist.songs && playlist.songs.length > 0;
            const songsCount = playlist.songs?.length || 0;
            
            return (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="group relative bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer"
              >
                {/* Playlist Art Cover */}
                <div className="relative aspect-square w-full mb-4 shadow-lg rounded overflow-hidden">
                  <img
                    src={playlist.coverImage || '/music_cover.png'}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {hasSongs && (
                      <button
                        onClick={(e) => handlePlayPlaylist(e, playlist)}
                        className="w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-xl"
                      >
                        {isPlaylistPlaying(playlist) ? (
                          <PauseIcon />
                        ) : (
                          <PlayArrowIcon />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Absolute Delete Button */}
                  <button
                    onClick={(e) => handleDeletePlaylist(e, playlist._id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-[#B3B3B3] hover:text-white transition-colors"
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </button>
                </div>

                <h4 className="text-sm font-bold truncate mb-1">{playlist.name}</h4>
                <p className="text-xs text-[#B3B3B3] truncate mb-2">
                  {playlist.description || 'Custom playlist'}
                </p>
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  {songsCount} {songsCount === 1 ? 'Song' : 'Songs'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PLAYLIST MODAL DIALOG */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
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
          <span className="font-extrabold text-lg">Create Playlist</span>
          <IconButton onClick={() => setOpenModal(false)} className="text-white hover:bg-neutral-800">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="!p-6">
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            
            {/* Cover Upload */}
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="cover-upload" className="cursor-pointer">
                <div className="w-36 h-36 border border-neutral-800 hover:border-[#1DB954] rounded-md overflow-hidden bg-neutral-900 flex items-center justify-center shadow-lg relative group transition-colors">
                  {coverImageBase64 ? (
                    <img
                      src={coverImageBase64}
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
                id="cover-upload"
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
                label="Description (Optional)"
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
                onClick={() => setOpenModal(false)}
                sx={{ color: '#FFFFFF', border: '1px solid #282828', py: 1.2, textTransform: 'none', fontWeight: 'bold' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={creating}
                sx={{
                  bgcolor: '#1DB954',
                  color: '#000000',
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#1ed760' },
                }}
              >
                {creating ? 'Creating...' : 'Create Playlist'}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Playlists;
