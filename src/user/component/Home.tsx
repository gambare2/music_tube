import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { HomeMusics, ArtistListData, type ArtistType } from "../data";
import Contact from "./Contact";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { motion } from "framer-motion";

// Artist list component
const ArtistList = ({ Artist }: { Artist: ArtistType[] }) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const loadMore = () => setVisibleCount((prev) => prev + 9);
  const visibleArtists = Artist.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-start w-full mb-4">
      <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar w-full px-4">
        {visibleArtists.map((artist, index) => (
          <Link
            to={`/artist/${artist.id}`}
            key={index}
            className="flex-shrink-0 w-24 p-2 text-center"
          >
            <img
              src={artist.thumbnail}
              alt={artist.name}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-1"
            />
            <span className="text-sm font-semibold block">{artist.name}</span>
          </Link>
        ))}
        {visibleCount < Artist.length && (
          <div
            onClick={loadMore}
            className="flex-shrink-0 w-24 p-2 text-center cursor-pointer hover:opacity-80"
          >
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-1">
              <span className="text-xl font-bold">+</span>
            </div>
            <span className="text-sm font-semibold block">More</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Home component
function Home() {
  return (
    <div className="w-full">
      {/* Video Section */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font1 text-neutral-600 mb-4 text-center">
            Popular Musics
          </h2>
          <div className="flex flex-row overflow-x-auto no-scrollbar space-x-4 px-4 py-2 w-full">
            {HomeMusics.map((video, index) => (
              <div
                key={index}
                className="min-w-[250px] md:min-w-[300px] rounded-lg shadow-md overflow-hidden flex flex-col bg-white"
              >
                <Link to={`/videoSection/${video.id}`} className="w-full">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex flex-col justify-between items-center bg-[#f5dfc9] border-t border-gray-300 p-3">
                    <div className="text-lg font-semibold text-center">{video.title}</div>
                    <span className="text-sm text-gray-600 font7 truncate w-full text-center">
                      {video.artist}
                    </span>
                    <div className="flex flex-row items-center justify-center mt-3 gap-3">
                      <SkipPreviousIcon className="text-gray-500 hover:text-gray-700" />
                      <PlayArrowIcon className="text-gray-500 hover:text-gray-700" />
                      <SkipNextIcon className="text-gray-500 hover:text-gray-700" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Artist Section */}
      <div className="mt-10">
        <h2 className="text-3xl md:text-4xl font1 text-neutral-600 mb-4 text-center">
          Famous Artists
        </h2>
        <ArtistList Artist={ArtistListData} />
      </div>

      <Divider className="my-6" />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}

export default Home;

