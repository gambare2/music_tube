import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtists, getTrendingArtists, getFollowedArtists, followArtist, unfollowArtist } from '../../api/artistApi';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';

const ArtistDiscovery: React.FC = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Classical', 'HipHop'];

  // Load trending and followed artists on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [trendingRes, followedRes] = await Promise.all([
          getTrendingArtists(18),
          getFollowedArtists().catch(() => ({ results: [] }))
        ]);
        setTrending(trendingRes.results || []);
        setFollowedIds((followedRes.results || []).map((a: any) => a.id));
      } catch (err) {
        console.error('Error fetching discovery data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Handle Search Query & Categories
  useEffect(() => {
    const handleSearch = async () => {
      const searchTerm = query.trim() || (activeCategory !== 'All' ? activeCategory : '');
      if (!searchTerm) {
        setArtists([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await getArtists(searchTerm, 24);
        setArtists(res.results || []);
      } catch (err) {
        console.error('Artist search failed:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Simple 400ms debounce
    const timer = setTimeout(handleSearch, 400);
    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  // Toggle Follow
  const handleFollowToggle = async (e: React.MouseEvent, artist: any) => {
    e.stopPropagation(); // prevent card click navigation
    const isFollowing = followedIds.includes(artist.id);
    
    try {
      if (isFollowing) {
        await unfollowArtist(artist.id);
        setFollowedIds(prev => prev.filter(id => id !== artist.id));
        toast.info(`Unfollowed ${artist.name}`);
      } else {
        const artistData = {
          id: artist.id,
          name: artist.name,
          image: artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150',
          followers: artist.followers || Math.floor(1000 + Math.random() * 500000)
        };
        await followArtist(artistData);
        setFollowedIds(prev => [...prev, artist.id]);
        toast.success(`Followed ${artist.name}`);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  const displayArtists = query || activeCategory !== 'All' ? artists : trending;

  return (
    <div className="space-y-8 text-white select-none">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Artist Discovery</h1>
        <p className="text-sm text-[#B3B3B3]">Explore and follow new rising talent around the world.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-xl">
        <SearchIcon className="absolute left-4 top-3.5 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveCategory('All');
          }}
          placeholder="Search for your favorite artists..."
          className="w-full h-12 bg-neutral-900 border border-transparent focus:border-neutral-700 text-white pl-12 pr-4 rounded-full text-sm font-semibold tracking-wide outline-none placeholder:text-neutral-500 transition-colors"
        />
      </div>

      {/* CATEGORIES CHIPS */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setQuery('');
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
              activeCategory === cat ? 'bg-[#1DB954] text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ARTISTS GRID */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-[#1DB954] rounded-full mr-3" />
          <span>Searching Jamendo catalog...</span>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-6 tracking-tight">
            {query || activeCategory !== 'All' ? 'Search Results' : 'Popular & Trending Artists'}
          </h3>
          
          {displayArtists.length === 0 ? (
            <div className="text-center py-20 text-neutral-500 italic">No artists found matching your criteria.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {displayArtists.map((artist, idx) => {
                const isFollowing = followedIds.includes(artist.id);
                // Mock deterministic follower count if not present
                const followerCount = artist.followers || Math.floor((parseInt(artist.id || '10', 16) || 123) % 495000 + 5000);
                
                return (
                  <div
                    key={artist.id + '-' + idx}
                    onClick={() => navigate(`/artist/${artist.id}`)}
                    className="group relative bg-[#181818]/40 hover:bg-[#181818] p-4 rounded-md transition-all duration-300 border border-neutral-900 hover:border-neutral-800 cursor-pointer text-center"
                  >
                    {/* Circle Image Wrapper */}
                    <div className="relative aspect-square w-full rounded-full overflow-hidden mb-4 shadow-lg">
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
                    <p className="text-xs text-[#B3B3B3] mb-4">
                      {followerCount.toLocaleString()} Followers
                    </p>

                    {/* Follow Toggler Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={(e) => handleFollowToggle(e, artist)}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 ${
                          isFollowing
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                            : 'bg-white hover:bg-neutral-100 text-black'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <PersonAddDisabledIcon sx={{ fontSize: 14 }} />
                            <span>Unfollow</span>
                          </>
                        ) : (
                          <>
                            <PersonAddIcon sx={{ fontSize: 14 }} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ArtistDiscovery;
