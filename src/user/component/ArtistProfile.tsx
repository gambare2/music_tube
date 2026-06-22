import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../shared/context/PlayerContext';
import { getArtistProfile, getFollowedArtists, followArtist, unfollowArtist } from '../../api/artistApi';
import { getLikedSongs, likeSong, getSavedSongs, saveSong } from '../../api/musicApi';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Menu, MenuItem, IconButton } from '@mui/material';

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  // Profile data states
  const [artist, setArtist] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction collections
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [savedSongIds, setSavedSongIds] = useState<string[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);

  // Playlist menu triggers
  const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSongToAddToPlaylist, setSelectedSongToAddToPlaylist] = useState<any>(null);

  // Load artist profile details and interaction statuses
  useEffect(() => {
    if (!id) return;
    
    const loadArtistData = async () => {
      try {
        setLoading(true);
        const [profileRes, followedRes, likesRes, savesRes, playlistsRes] = await Promise.all([
          getArtistProfile(id),
          getFollowedArtists().catch(() => ({ results: [] })),
          getLikedSongs().catch(() => ({ results: [] })),
          getSavedSongs().catch(() => ({ results: [] })),
          getPlaylists().catch(() => ({ results: [] }))
        ]);

        if (profileRes.artist) {
          setArtist(profileRes.artist);
          setTracks(profileRes.tracks || []);
          setAlbums(profileRes.albums || []);
          
          // Set followed state
          const followed = followedRes.results || [];
          setIsFollowing(followed.some((a: any) => a.id === profileRes.artist.id));
        }

        setLikedSongIds((likesRes.results || []).map((s: any) => s.id));
        setSavedSongIds((savesRes.results || []).map((s: any) => s.id));
        setUserPlaylists(playlistsRes.results || []);

        // Load related artists by querying general category
        const relRes = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/music/artists?limit=6`
        );
        const relData = await relRes.json();
        setRelated(relData.results || []);
      } catch (err) {
        console.error('Error loading artist details:', err);
        toast.error('Failed to load artist profile');
      } finally {
        setLoading(false);
      }
    };

    loadArtistData();
  }, [id]);

  // Toggle Follow Artist
  const handleFollowToggle = async () => {
    if (!artist) return;
    try {
      if (isFollowing) {
        await unfollowArtist(artist.id);
        setIsFollowing(false);
        toast.info(`Unfollowed ${artist.name}`);
      } else {
        const artistData = {
          id: artist.id,
          name: artist.name,
          image: artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150',
          followers: Math.floor(10000 + Math.random() * 900000)
        };
        await followArtist(artistData);
        setIsFollowing(true);
        toast.success(`Followed ${artist.name}`);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  // Play song handler
  const handlePlaySong = (song: any) => {
    const formattedTrack = {
      id: song.id,
      name: song.name,
      artist_name: song.artist_name || artist.name,
      audio: song.audio,
      album_image: song.album_image || '/music_cover.png',
    };
    const formattedQueue = tracks.map(t => ({
      id: t.id,
      name: t.name,
      artist_name: t.artist_name || artist.name,
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
        // Unlike backend
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
        // Unsave backend
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

  // Duration parser helper (seconds to mm:ss)
  const formatDuration = (secs: number) => {
    if (!secs) return '3:15'; // fallback default
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-neutral-400 select-none">
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-[#1DB954] rounded-full mb-4" />
        <span>Loading artist profile...</span>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-20 text-red-500 font-bold select-none">
        Artist profile not found.
      </div>
    );
  }

  // Deterministic listeners count
  const monthlyListeners = Math.floor((parseInt(artist.id || '2', 16) || 1234) % 1800000 + 100000);

  return (
    <div className="space-y-10 text-white select-none relative">
      
      {/* 1. ARTIST HERO BANNER */}
      <div className="relative w-full h-[320px] md:h-[400px] -mt-6 -mx-6 bg-[#181818] overflow-hidden flex items-end p-8 md:p-12 border-b border-neutral-900">
        {/* Background Image Banner */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 filter brightness-[0.4] blur-sm scale-105"
          style={{ backgroundImage: `url(${artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent" />

        <div className="z-10 flex items-center gap-6 md:gap-8 w-full max-w-7xl mx-auto">
          <img
            src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
            alt={artist.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150';
            }}
            className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover shadow-2xl border-2 border-white/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-1 uppercase tracking-widest">
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              <span>Verified Artist</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-3">
              {artist.name}
            </h1>
            <p className="text-sm md:text-base font-semibold text-[#B3B3B3]">
              {monthlyListeners.toLocaleString()} monthly listeners
            </p>
          </div>
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

        <button
          onClick={handleFollowToggle}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase border transition-all active:scale-95 ${
            isFollowing
              ? 'bg-transparent hover:bg-neutral-800 text-white border-neutral-700'
              : 'bg-white hover:bg-neutral-100 text-black border-transparent'
          }`}
        >
          {isFollowing ? (
            <>
              <PersonAddDisabledIcon sx={{ fontSize: 16 }} />
              <span>Unfollow Artist</span>
            </>
          ) : (
            <>
              <PersonAddIcon sx={{ fontSize: 16 }} />
              <span>Follow Artist</span>
            </>
          )}
        </button>
      </div>

      {/* 3. POPULAR SONGS TABLE */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Popular Tracks</h2>
        {tracks.length === 0 ? (
          <p className="text-neutral-500 italic text-sm">No tracks available.</p>
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
                      <p className="text-xs text-[#B3B3B3] truncate">{track.artist_name || artist.name}</p>
                    </div>
                  </div>

                  {/* Right Side: Duration & Options */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Hover items */}
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
                    {/* Duration label */}
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

      {/* 4. BIOGRAPHY CARD */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 tracking-tight">About Artist</h2>
        <div className="bg-[#181818] p-6 rounded-lg border border-neutral-800 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-neutral-200">Biography</h3>
            <p className="text-sm text-[#B3B3B3] leading-relaxed">
              {artist.biography || (
                `Known worldwide for creating exceptional sonic soundscapes, ${artist.name} is a pioneer in blending emotional storytelling with immersive beats. Having accumulated millions of plays globally, their contribution to the modern music industry remains highly influential. Inspired by real-life journeys and deep artistic exploration, they continue to release genre-defining catalog tracks.`
              )}
            </p>
          </div>
          <img
            src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
            alt="bio_image"
            className="w-48 h-48 object-cover rounded-md border border-neutral-800 hidden md:block shrink-0"
          />
        </div>
      </div>

      {/* 5. ALBUMS SECTION */}
      {albums.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Albums & Releases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {albums.map((album, idx) => (
              <div
                key={album.id + '-' + idx}
                className="group bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800"
              >
                <div className="aspect-square w-full rounded overflow-hidden mb-4 shadow-lg">
                  <img
                    src={album.image || '/music_cover.png'}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-sm font-bold truncate mb-1">{album.name}</h4>
                <p className="text-xs text-neutral-500">Album • {album.releasedate || 'Recent'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. RELATED ARTISTS */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Fans Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {related.slice(0, 6).map((item, idx) => (
              <div
                key={item.id + '-rel-' + idx}
                onClick={() => navigate(`/artist/${item.id}`)}
                className="group bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer text-center"
              >
                <div className="aspect-square w-full rounded-full overflow-hidden mb-4 shadow-lg">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-sm font-bold truncate">{item.name}</h4>
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

export default ArtistProfile;
