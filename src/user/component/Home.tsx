import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import Contact from "./Contact";
import { motion } from "framer-motion";
import { type JamendoArtist, type JamendoTrack } from "../data";



const ArtistList = ({ artists }: { artists: JamendoArtist[] }) => {
  const [visibleCount, setVisibleCount] = useState(9);
  const loadMore = () => setVisibleCount((prev) => prev + 20);
  const visibleArtists = artists.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-start w-full mb-4">
      <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar  w-full px-4">
        {visibleArtists.map((artist, index) => (
          <a
            href={artist.shareurl}
            key={index}
            className="flex-shrink-0 w-48 p-2 text-center border-2 border-gray-300 bg-orange-50 rounded-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={artist.image || "/artist_default.jpg"}
              alt={artist.name}
              className=" rounded-full object-cover mx-auto mb-1"
            />
            <span className="text-sm font-semibold block">{artist.name}</span>
          </a>
        ))}
        {visibleCount < artists.length && (
          <div
            onClick={loadMore}
            className="flex-shrink-0 w-24 p-2 text-center content-center cursor-pointer hover:opacity-80"
          >
            <div className="w-16 h-16 rounded-full bg-gray-300  flex items-center justify-center mx-auto mb-1">
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
      try {
        const artistRes = await fetch
        (`${import.meta.env.VITE_API_URL}/audios/artists`);
        // ("http://localhost:5000/api/audios/artists");
        const trackRes = await fetch
        (`${import.meta.env.VITE_API_URL}/audios/tracks`);
        // ("http://localhost:5000/api/audios/tracks");

        const artistsData = await artistRes.json();
        const tracksData = await trackRes.json();

        console.log("Artists Response:", artistsData);
        console.log("Tracks Response:", tracksData);

        setArtists(Array.isArray(artistsData.results) ? artistsData.results : []);
        setTracks(Array.isArray(tracksData.results) ? tracksData.results : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setArtists([]);
        setTracks([]);
      }
    };

    fetchData();
  }, []);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     const artistRes = await fetch
  //     ("http://localhost:5000/api/audios/artists");
  //     // (`${import.meta.env.VITE_API_URL}/audios/artists`);
  //     const trackRes = await fetch
  //     ("http://localhost:5000/api/audios/tracks/trending");
  //     // (`${import.meta.env.VITE_API_URL}/audios/tracks/trending`);


  //     const artistsData = await artistRes.json();
  //     const tracksData = await trackRes.json();

  //     console.log("Artists Response:", artistsData);
  //     console.log("Tracks Response:", tracksData);

  //     setArtists(artistsData.data);
  //     setTracks(tracksData.data);
  //   };

  //   fetchData();
  // }, []);
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
            {Array.isArray(tracks) && tracks.length > 0 ? (
              tracks.map((track, index) => (
                <div key={index} className="min-w-[250px] md:min-w-[300px] rounded-lg shadow-md bg-white">
                  <a href={track.audio} target="_blank" rel="noopener noreferrer">
                    <img
                      src={track.album_image || "/music_cover.png"}
                      alt={track.name || "Unknown Track"}
                      className="w-full h-40 object-cover"
                    />
                    <div className="flex flex-col items-center bg-[#f5dfc9] border-t border-gray-300 p-3">
                      <div className="text-lg font-semibold text-center">{track.name || "Untitled"}</div>
                      <span className="text-sm text-gray-600 truncate w-full text-center">
                        {track.artist_name || "Unknown Artist"}
                      </span>
                      <audio controls className="mt-2 w-full">
                        <source src={track.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No tracks available.</p>
            )}

              <span className="inline-block text-gray-500 relative top-10 left-10 border-2 border-gray-300 rounded-md p-3 mr-5 w-max h-max text-left">
                Search for more music ...
              </span>

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

