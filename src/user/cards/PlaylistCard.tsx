import React from 'react';

interface Props {
  playlist: {
    _id: string;
    title: string;
    songs: string[];
    createdAt: string;
  };
}

const PlaylistCard: React.FC<Props> = ({ playlist }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-all">
      <h2 className="text-lg font-semibold">{playlist.title}</h2>
      <p className="text-sm text-gray-500">{playlist.songs.length} songs</p>
      <p className="text-xs text-gray-400 mt-2">Created: {new Date(playlist.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default PlaylistCard;
