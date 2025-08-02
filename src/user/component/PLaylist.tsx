import { useEffect } from "react";
import { usePlaylist } from "../../shared/context/Playlistcontext";
import { Link } from "react-router-dom";

function Playlists() {
  const { playlists } = usePlaylist();
  useEffect(() => {
    console.log("Playlists in component:", playlists);
  }, [playlists]);

  if (playlists.length === 0) {
    return <div className="text-center text-xl mt-8">No playlists created yet.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Playlists</h2>

      <div className="flex flex-col gap-8">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="border border-gray-300 rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-neutral-700">{playlist.name}</h3>

            {playlist.videos.length === 0 ? (
              <p className="text-gray-500 italic">No videos in this playlist.</p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-start">
                {playlist.videos.map((video) => (
                  <Link
                    to={`/videoSection/${video.id}`}
                    key={video.id}
                    className="w-52 p-2 border rounded-md hover:shadow-md"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-28 object-cover rounded"
                    />
                    <h4 className="text-md font-medium mt-2 text-center">{video.title}</h4>
                    <p className="text-xs text-gray-500 truncate text-center">
                      {video.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlists;


