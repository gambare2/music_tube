import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../shared/context/PlayerContext';
import { getGenres, getRecommendations, getHistory } from '../../api/musicApi';
import { getTrendingArtists } from '../../api/artistApi';
import { getPlaylists } from '../../api/playlistApi';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  // States
  const [trendingTracks, setTrendingTracks] = useState<any[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [historyTracks, setHistoryTracks] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Parallel API fetches
        const [genresRes, recsRes, historyRes, artistsRes, playlistsRes] = await Promise.all([
          getGenres().catch(() => ({ genres: [] })),
          getRecommendations().catch(() => ({ results: [] })),
          getHistory().catch(() => ({ results: [] })),
          getTrendingArtists(12).catch(() => ({ results: [] })),
          getPlaylists().catch(() => ({ results: [] }))
        ]);

        setGenres(genresRes.genres || []);
        setRecommendedTracks(recsRes.results || []);
        
        // Map history to simple track array
        const historyList = (historyRes.results || []).map((item: any) => item.song);
        setHistoryTracks(historyList);
        
        setTopArtists(artistsRes.results || []);
        setPlaylists(playlistsRes.results || []);

        // Load trending tracks from recommendations or general Jamendo tracks endpoint
        const trendingRes = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/music/search?q=hits&limit=15`
        );
        const trendingData = await trendingRes.json();
        setTrendingTracks(trendingData.tracks || []);
      } catch (err) {
        console.error('Error loading home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Quick Play Handler
  const handlePlaySong = (track: any, queueContext: any[]) => {
    const formattedTrack = {
      id: track.id,
      name: track.name,
      artist_name: track.artist_name || track.artist,
      audio: track.audio,
      album_image: track.album_image || track.image || '/music_cover.png',
    };
    const formattedQueue = queueContext.map(t => ({
      id: t.id,
      name: t.name,
      artist_name: t.artist_name || t.artist,
      audio: t.audio,
      album_image: t.album_image || t.image || '/music_cover.png',
    }));
    playTrack(formattedTrack, formattedQueue);
  };

  const isSongPlaying = (trackId: string) => {
    return currentTrack?.id === trackId && isPlaying;
  };

  // Skeleton Loader Component
  const CardSkeleton = () => (
    <div className="flex-shrink-0 w-44 bg-[#181818] p-4 rounded-md animate-pulse">
      <div className="w-full aspect-square bg-neutral-800 rounded-md mb-4" />
      <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-neutral-800 rounded w-1/2" />
    </div>
  );

  const heroTrack = trendingTracks[0] || recommendedTracks[0];

  return (
    <div className="space-y-10 text-white select-none">
      
      {/* 1. HERO BANNER SECTION */}
      {loading ? (
        <div className="w-full h-64 md:h-80 bg-[#181818] rounded-xl animate-pulse" />
      ) : (
        heroTrack && (
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-r from-green-900/60 to-black border border-neutral-800 flex items-center p-8 md:p-12">
            {/* Background Blur Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl -z-10"
              style={{ backgroundImage: `url(${heroTrack.album_image})` }}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="z-10 flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
              <img
                src={heroTrack.album_image || "/music_cover.png"}
                alt={heroTrack.name}
                className="w-32 h-32 md:w-44 md:h-44 rounded-lg object-cover shadow-2xl border border-neutral-700/50"
              />
              <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-2 md:pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1DB954] mb-2 block">
                  Trending Now
                </span>
                <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-2 truncate max-w-[500px]">
                  {heroTrack.name}
                </h1>
                <p className="text-sm md:text-lg text-[#B3B3B3] mb-6 font-medium">
                  {heroTrack.artist_name}
                </p>
                <div className="flex justify-center md:justify-start">
                  <button
                    onClick={() => handlePlaySong(heroTrack, trendingTracks)}
                    className="flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg active:scale-95"
                  >
                    {isSongPlaying(heroTrack.id) ? (
                      <>
                        <PauseIcon /> <span>Pause Playback</span>
                      </>
                    ) : (
                      <>
                        <PlayArrowIcon /> <span>Play Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* 2. QUICK PLAY GRID ("Good Evening") */}
      {trendingTracks.length > 0 && !loading && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Quick Stream</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTracks.slice(1, 7).map((track, idx) => (
              <div
                key={track.id + '-' + idx}
                className="group relative flex items-center bg-[#181818]/60 hover:bg-[#282828] border border-neutral-900 rounded-md overflow-hidden transition-all duration-300 shadow-md cursor-pointer pr-16"
                onClick={() => handlePlaySong(track, trendingTracks)}
              >
                <img
                  src={track.album_image || '/music_cover.png'}
                  alt={track.name}
                  className="w-20 h-20 object-cover border-r border-neutral-900 shrink-0"
                />
                <div className="px-4 overflow-hidden">
                  <h4 className="text-sm font-bold truncate">{track.name}</h4>
                  <p className="text-xs text-[#B3B3B3] truncate">{track.artist_name}</p>
                </div>
                {/* Hover Play Button */}
                <button
                  className="absolute right-4 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 z-10"
                >
                  {isSongPlaying(track.id) ? <PauseIcon /> : <PlayArrowIcon />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECENTLY PLAYED SLIDER */}
      {historyTracks.length > 0 && !loading && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Recently Played</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {historyTracks.map((track, idx) => (
              <div
                key={track.id + '-history-' + idx}
                className="group relative flex-shrink-0 w-44 bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800"
              >
                <div className="relative aspect-square w-full mb-4 shadow-lg">
                  <img
                    src={track.album_image || '/music_cover.png'}
                    alt={track.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => handlePlaySong(track, historyTracks)}
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 z-10"
                  >
                    {isSongPlaying(track.id) ? <PauseIcon /> : <PlayArrowIcon />}
                  </button>
                </div>
                <h4 className="text-sm font-bold truncate mb-1">{track.name}</h4>
                <p className="text-xs text-[#B3B3B3] truncate">{track.artist_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RECOMMENDED FOR YOU SLIDER */}
      <div>
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Recommended For You</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {loading ? (
            Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : recommendedTracks.length === 0 ? (
            <div className="text-neutral-500 italic text-sm py-4">No recommendations available yet. Start listening!</div>
          ) : (
            recommendedTracks.map((track, idx) => (
              <div
                key={track.id + '-rec-' + idx}
                className="group relative flex-shrink-0 w-44 bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800"
              >
                <div className="relative aspect-square w-full mb-4 shadow-lg">
                  <img
                    src={track.album_image || '/music_cover.png'}
                    alt={track.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => handlePlaySong(track, recommendedTracks)}
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 z-10"
                  >
                    {isSongPlaying(track.id) ? <PauseIcon /> : <PlayArrowIcon />}
                  </button>
                </div>
                <h4 className="text-sm font-bold truncate mb-1">{track.name}</h4>
                <p className="text-xs text-[#B3B3B3] truncate">{track.artist_name}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. TOP ARTISTS SLIDER */}
      <div>
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Top Artists</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 bg-[#181818] p-4 rounded-md animate-pulse">
                <div className="w-full aspect-square bg-neutral-800 rounded-full mb-4" />
                <div className="h-4 bg-neutral-800 rounded w-2/3 mx-auto" />
              </div>
            ))
          ) : topArtists.length === 0 ? (
            <div className="text-neutral-500 italic text-sm py-4">No artists available.</div>
          ) : (
            topArtists.map((artist, idx) => (
              <div
                key={artist.id + '-artist-' + idx}
                onClick={() => navigate(`/artist/${artist.id}`)}
                className="group flex-shrink-0 w-44 bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer text-center"
              >
                <div className="relative aspect-square w-full mb-4 shadow-lg rounded-full overflow-hidden">
                  <img
                    src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
                    alt={artist.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-sm font-bold truncate mb-1">{artist.name}</h4>
                <p className="text-xs text-[#B3B3B3]">Artist</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. POPULAR GENRES */}
      {genres.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Popular Genres</h2>
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
      )}

      {/* 7. FEATURED PLAYLISTS */}
      {playlists.length > 0 && !loading && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Featured Playlists</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {playlists.map((playlist, idx) => (
              <div
                key={playlist._id + '-' + idx}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="group relative flex-shrink-0 w-44 bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer"
              >
                <div className="relative aspect-square w-full mb-4 shadow-lg">
                  <img
                    src={playlist.coverImage || '/music_cover.png'}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <MusicNoteIcon fontSize="large" className="text-white" />
                  </div>
                </div>
                <h4 className="text-sm font-bold truncate mb-1">{playlist.name}</h4>
                <p className="text-xs text-[#B3B3B3] truncate">{playlist.description || `By ${playlist.creator?.name || 'User'}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
