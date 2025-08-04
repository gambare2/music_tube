import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import Contact from "./Contact";
import { motion } from "framer-motion";
import { type JamendoArtist, type JamendoTrack } from "../data";



const ArtistList = ({ artists }: { artists: JamendoArtist[] }) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const loadMore = () => setVisibleCount((prev) => prev + 9);
  const visibleArtists = artists.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-start w-full mb-4">
      <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar w-full px-4">
      {visibleArtists.map((artist, index) => (
          <a
            href={artist.shareurl}
            key={index}
            className="flex-shrink-0 w-24 p-2 text-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={artist.image || "https://placehold.co/64x64"}
              alt={artist.name}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-1"
            />
            <span className="text-sm font-semibold block">{artist.name}</span>
          </a>
        ))}
        {visibleCount < artists.length && (
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
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);
  const [artists, setArtists] = useState<JamendoArtist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const artistRes = await fetch(`${import.meta.env.VITE_API_URL}/audios/artists`);
      const trackRes = await fetch(`${import.meta.env.VITE_API_URL}/audios/tracks/trending`);

      const artistsData = await artistRes.json();
      const tracksData = await trackRes.json();

      console.log("Artists Response:", artistsData);
      console.log("Tracks Response:", tracksData);

      setArtists(artistsData.data);
      setTracks(tracksData.data);
    };

    fetchData();
  }, []);
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
            {tracks.map((track, index) => (
              <div key={index} className="min-w-[250px] md:min-w-[300px] rounded-lg shadow-md bg-white">
                <a href={track.audio} target="_blank" rel="noopener noreferrer">
                  <img
                    src={track.album_image || "https://placehold.co/400x200"}
                    alt={track.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex flex-col items-center bg-[#f5dfc9] border-t border-gray-300 p-3">
                    <div className="text-lg font-semibold text-center">{track.name}</div>
                    <span className="text-sm text-gray-600 truncate w-full text-center">{track.artist_name}</span>
                    <audio controls className="mt-2 w-full">
                      <source src={track.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </a>
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
        <ArtistList artists={artists} />
      </div>

      <Divider className="my-6" />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}

export default Home;

