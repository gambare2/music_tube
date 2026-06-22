import React, { useState, useEffect } from 'react';
import { getListeningStats } from '../../api/musicApi';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Card, Typography, Grid, Box, CircularProgress } from '@mui/material';

interface StatsData {
  totalTracksPlayed: number;
  likedSongsCount: number;
  followedArtistsCount: number;
  totalListeningTime: number;
  topGenres: Array<{ name: string; count: number }>;
  topArtists: Array<{ name: string; count: number }>;
  listeningTime: Array<{ day: string; minutes: number }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getListeningStats();
        if (res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={20} gap={2}>
        <CircularProgress color="primary" />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Calculating your listening statistics...</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h6" color="text.secondary">No listening statistics available yet. Start streaming to gather insights!</Typography>
      </Box>
    );
  }

  // Helper for generating curved SVG path for line chart
  const getLineChartPath = (
    data: Array<{ day: string; minutes: number }>,
    width: number,
    height: number
  ) => {
    if (data.length === 0) {
      return {
        path: '',
        points: [],
        maxVal: 0,
      };
    }

    const maxVal = Math.max(...data.map(d => d.minutes), 60);

    const points = data.map((d, index) => {
      const x = (index / (data.length - 1)) * (width - 60) + 30;
      const y = height - ((d.minutes / maxVal) * (height - 40) + 20);
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];

      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;

      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;

      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }

    return { path, points };
  };

  const chartWidth = 500;
  const chartHeight = 220;
  const { path: linePath, points: chartPoints } = getLineChartPath(stats.listeningTime, chartWidth, chartHeight);

  // Closed path for the gradient area under the line
  const areaPath = linePath ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - 20} L ${chartPoints[0].x} ${chartHeight - 20} Z` : '';

  return (
    <Box className="space-y-8 text-white select-none">

      {/* HEADER SECTION */}
      <div>
        <Typography variant="h4" fontWeight="extrabold" tracking-tight="true" sx={{ color: 'text.primary', mb: 1 }}>
          Listening Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Personalized dashboard visualizing your listening habits and musical preferences.
        </Typography>
      </div>

      {/* METRICS ROW */}
      <Grid container spacing={4}>

        {/* Total Played */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{
            p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            display: 'flex', alignItems: 'center', gap: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Box p={1.5} borderRadius="12px" sx={{ bgcolor: 'rgba(29, 185, 84, 0.1)', color: '#1DB954' }}>
              <PlayArrowIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>{stats.totalTracksPlayed}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'semibold' }}>Tracks Streamed</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Liked Songs */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{
            p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            display: 'flex', alignItems: 'center', gap: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Box p={1.5} borderRadius="12px" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <FavoriteIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>{stats.likedSongsCount}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'semibold' }}>Liked Tracks</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Followed Artists */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{
            p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            display: 'flex', alignItems: 'center', gap: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Box p={1.5} borderRadius="12px" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <PersonIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>{stats.followedArtistsCount}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'semibold' }}>Artists Followed</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Listening Time */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{
            p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            display: 'flex', alignItems: 'center', gap: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Box p={1.5} borderRadius="12px" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <AccessTimeIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>
                {Math.floor(stats.totalListeningTime / 60)}h {stats.totalListeningTime % 60}m
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'semibold' }}>Listening Time</Typography>
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* CHARTS ROW */}
      <Grid container spacing={4}>

        {/* Weekly Activity Line Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 4, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary', mb: 3 }}>
              Weekly Activity (Minutes Played)
            </Typography>

            <Box width="100%" sx={{ overflowX: 'auto', py: 1 }}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} style={{ minWidth: '400px' }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1DB954" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1DB954" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="30" y1="20" x2={chartWidth - 30} y2="20" stroke="rgba(128,128,128,0.15)" strokeDasharray="4 4" />
                <line x1="30" y1={(chartHeight - 40) / 2 + 20} x2={chartWidth - 30} y2={(chartHeight - 40) / 2 + 20} stroke="rgba(128,128,128,0.15)" strokeDasharray="4 4" />
                <line x1="30" y1={chartHeight - 20} x2={chartWidth - 30} y2={chartHeight - 20} stroke="rgba(128,128,128,0.2)" />

                {/* Gradient area */}
                {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

                {/* Curved line */}
                {linePath && <path d={linePath} fill="none" stroke="#1DB954" strokeWidth="4" strokeLinecap="round" />}

                {/* Dots and Labels */}
                {chartPoints.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#1DB954" stroke="currentColor" strokeWidth="1.5" style={{ cursor: 'pointer' }} />
                    <text x={pt.x} y={chartHeight - 4} textAnchor="middle" fill="gray" fontSize="10" fontWeight="bold">
                      {stats.listeningTime[idx].day}
                    </text>
                    <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">
                      {stats.listeningTime[idx].minutes}m
                    </text>
                  </g>
                ))}
              </svg>
            </Box>
          </Card>
        </Grid>

        {/* Top Genres Bar Chart */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 4, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary', mb: 3 }}>
              Your Top Genres
            </Typography>

            <Box className="space-y-5">
              {stats.topGenres.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', italic: 'true' }}>No genre data found yet.</Typography>
              ) : (
                stats.topGenres.map((genre, idx) => {
                  const maxCount = stats.topGenres[0]?.count || 1;
                  const percentage = Math.round((genre.count / maxCount) * 100);

                  // Aesthetic gradients for genres
                  const colors = [
                    'linear-gradient(90deg, #1DB954 0%, #1ed760 100%)',
                    'linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)',
                    'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
                    'linear-gradient(90deg, #f59e0b 0%, #eab308 100%)',
                    'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)'
                  ];

                  return (
                    <Box key={idx} className="space-y-1.5">
                      <Box display="flex" justifyContent="between" alignItems="center">
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary', flex: 1 }}>{genre.name}</Typography>
                        <Typography variant="body2" fontWeight="semibold" sx={{ color: 'text.secondary' }}>{genre.count} streams</Typography>
                      </Box>
                      <Box width="100%" height={8} borderRadius={4} sx={{ bgcolor: 'action.hover', overflow: 'hidden' }}>
                        <Box
                          height="100%"
                          borderRadius={4}
                          style={{
                            width: `${percentage}%`,
                            background: colors[idx % colors.length],
                            transition: 'width 1s ease-out'
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* TOP ARTISTS ROW */}
      <Card sx={{ p: 4, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary', mb: 3 }}>
          Most Played Artists
        </Typography>

        <Grid container spacing={3}>
          {stats.topArtists.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', italic: 'true' }}>No artist play data available yet.</Typography>
            </Grid>
          ) : (
            stats.topArtists.map((artist, idx) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={idx}>
                <Box textAlign="center" className="space-y-2 group">
                  <Box sx={{
                    position: 'relative', width: 90, height: 90, mx: 'auto', borderRadius: '50%', overflow: 'hidden',
                    border: '2px solid', borderColor: 'divider', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    <img
                      src={`https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150`}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Box>
                  <div>
                    <Typography variant="body2" fontWeight="bold" noWrap sx={{ color: 'text.primary' }}>
                      {artist.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {artist.count} plays
                    </Typography>
                  </div>
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      </Card>

    </Box>
  );
};

export default Dashboard;
