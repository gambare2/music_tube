import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../shared/context/PlayerContext';
import { searchMusic, likeSong, saveSong, getLikedSongs, getSavedSongs, getGenres } from '../../api/musicApi';
import { getPlaylists, addSongToPlaylist } from '../../api/playlistApi';
import { toast } from 'react-toastify';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ClearIcon from '@mui/icons-material/Clear';
import { Menu, MenuItem, IconButton } from '@mui/material';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  // Search states
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'artists' | 'albums'>('all');
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Interaction collections
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [savedSongIds, setSavedSongIds] = useState<string[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);

  // Add-to-playlist state
  const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSongToAddToPlaylist, setSelectedSongToAddToPlaylist] = useState<any>(null);

  // History state
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('recent_searches') || '[]');
  });

  const searchTimeoutRef = useRef<number | null>(null);

  // Load static genres and interaction databases
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [genresRes, likesRes, savesRes, playlistsRes] = await Promise.all([
          getGenres().catch(() => ({ genres: [] })),
          getLikedSongs().catch(() => ({ results: [] })),
          getSavedSongs().catch(() => ({ results: [] })),
          getPlaylists().catch(() => ({ results: [] }))
        ]);
        setGenres(genresRes.genres || []);
        setLikedSongIds((likesRes.results || []).map((s: any) => s.id));
        setSavedSongIds((savesRes.results || []).map((s: any) => s.id));
        setUserPlaylists(playlistsRes.results || []);
      } catch (err) {
        console.error('Error fetching search page assets:', err);
      }
    };
    loadStaticData();
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        const results = await searchMusic(query);
        setTracks(results.tracks || []);
        setArtists(results.artists || []);
        setAlbums(results.albums || []);

        // Log to search history
        saveRecentSearch(query.trim());
      } catch (err) {
        console.error('Search request failed:', err);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Save query to localStorage history
  const saveRecentSearch = (searchVal: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== searchVal);
      const updated = [searchVal, ...filtered].slice(0, 8); // cap at 8
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear query
  const clearSearch = () => {
    setQuery('');
    setTracks([]);
    setArtists([]);
    setAlbums([]);
  };

  // Clear single recent search item
  const deleteRecentSearch = (e: React.MouseEvent, searchVal: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== searchVal);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Play button handler
  const handlePlaySong = (song: any) => {
    const formattedTrack = {
      id: song.id,
      name: song.name,
      artist_name: song.artist_name,
      audio: song.audio,
      album_image: song.album_image || '/music_cover.png',
    };
    // Queue is the rest of searched tracks
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

  return (
    <div className="space-y-8 text-white select-none">
      
      {/* 1. SEARCH INPUT ROW */}
      <div className="relative w-full max-w-xl">
        <SearchIcon className="absolute left-4 top-3.5 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full h-12 bg-neutral-900 border border-transparent focus:border-neutral-700 text-white pl-12 pr-12 rounded-full text-sm font-semibold tracking-wide outline-none placeholder:text-neutral-500 transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-3 text-neutral-400 hover:text-white"
          >
            <ClearIcon fontSize="small" />
          </button>
        )}
      </div>

      {/* 2. RECENT SEARCHES OR GENRES LIST */}
      {!query && (
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setQuery(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full text-sm font-semibold cursor-pointer group"
                  >
                    <span>{item}</span>
                    <button
                      onClick={(e) => deleteRecentSearch(e, item)}
                      className="text-neutral-500 hover:text-white group-hover:block transition-colors"
                    >
                      <ClearIcon sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold mb-4">Browse All Genres</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {genres.map((genre) => (
                <div
                  key={genre.name}
                  onClick={() => navigate(`/genre/${genre.name}`)}
                  className={`relative h-28 rounded-md overflow-hidden bg-gradient-to-br ${genre.color} shadow-lg hover:scale-[1.02] cursor-pointer transition-all duration-200 p-4 border border-white/5 group`}
                >
                  <span className="text-base font-extrabold tracking-tight">{genre.name}</span>
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="absolute -right-4 -bottom-4 w-16 h-16 rotate-[25deg] group-hover:scale-110 transition-transform object-cover shadow-2xl opacity-60 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SEARCH RESULTS LAYOUT */}
      {query && (
        <div className="space-y-6">
          {/* Tabs Filter Bar */}
          <div className="flex gap-2 border-b border-neutral-900 pb-2">
            {(['all', 'songs', 'artists', 'albums'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-neutral-400">
              <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-[#1DB954] rounded-full mr-3" />
              <span>Searching Jamendo database...</span>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* SONGS RESULTS */}
              {(activeTab === 'all' || activeTab === 'songs') && tracks.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Songs</h3>
                  <div className="flex flex-col gap-2">
                    {tracks.slice(0, activeTab === 'all' ? 5 : 20).map((track, idx) => {
                      const liked = likedSongIds.includes(track.id);
                      const saved = savedSongIds.includes(track.id);
                      return (
                        <div
                          key={track.id + '-' + idx}
                          className="group flex items-center justify-between p-2 hover:bg-neutral-900/60 rounded-md transition-colors border border-transparent hover:border-neutral-900"
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="relative w-11 h-11 shrink-0">
                              <img
                                src={track.album_image || '/music_cover.png'}
                                alt={track.name}
                                className="w-full h-full object-cover rounded"
                              />
                              <button
                                onClick={() => handlePlaySong(track)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded transition-opacity"
                              >
                                {isPlayingSong(track.id) ? (
                                  <PauseIcon className="text-white" />
                                ) : (
                                  <PlayArrowIcon className="text-white" />
                                )}
                              </button>
                            </div>
                            <div className="truncate">
                              <h4 className={`text-sm font-semibold truncate ${isPlayingSong(track.id) ? 'text-[#1DB954]' : 'text-white'}`}>
                                {track.name}
                              </h4>
                              <p className="text-xs text-[#B3B3B3] truncate">{track.artist_name}</p>
                            </div>
                          </div>

                          {/* Hover Operations */}
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ARTISTS RESULTS */}
              {(activeTab === 'all' || activeTab === 'artists') && artists.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Artists</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {artists.slice(0, activeTab === 'all' ? 6 : 18).map((artist, idx) => (
                      <div
                        key={artist.id + '-' + idx}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                        className="group bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer text-center"
                      >
                        <div className="aspect-square w-full rounded-full overflow-hidden mb-4 shadow-lg">
                          <img
                            src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
                            alt={artist.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="text-sm font-bold truncate">{artist.name}</h4>
                        <p className="text-xs text-[#B3B3B3] mt-1">Artist</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ALBUMS RESULTS */}
              {(activeTab === 'all' || activeTab === 'albums') && albums.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Albums</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {albums.slice(0, activeTab === 'all' ? 6 : 18).map((album, idx) => (
                      <div
                        key={album.id + '-' + idx}
                        className="group bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer"
                      >
                        <div className="aspect-square w-full overflow-hidden mb-4 shadow-lg rounded">
                          <img
                            src={album.image || '/music_cover.png'}
                            alt={album.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="text-sm font-bold truncate mb-1">{album.name}</h4>
                        <p className="text-xs text-[#B3B3B3] truncate">{album.artist_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tracks.length === 0 && artists.length === 0 && albums.length === 0 && (
                <div className="text-center py-20 text-neutral-500 italic">
                  No matches found for "{query}". Try a different keyword.
                </div>
              )}

            </div>
          )}
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

export default Search;
