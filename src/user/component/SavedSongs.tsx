
import { useSaved } from '../../shared/context/Savedcontext';
import { Link } from 'react-router-dom';

function SavedSongs() {
  const { SavedVideos } = useSaved();

  if (SavedVideos.length === 0) {
    return <div className="text-center text-xl mt-8">No saved songs yet.</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {SavedVideos.map((video) => (
        <div
          key={video.id}
          className="w-1/4 md:my-2 overflow-hidden p-2 mx-3 border-2 border-gray-300 rounded-lg flex flex-col items-center"
        >
          <Link to={`/videoSection/${video.id}`} className="w-full flex flex-col items-center">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-auto object-cover mb-2 rounded-lg"
            />
            <span className="text-lg font-semibold text-center">{video.title}</span>
            <p className="text-sm text-gray-500 font7 truncate whitespace-nowrap overflow-hidden w-full text-center">
              {video.description}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default SavedSongs;

