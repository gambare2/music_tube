import { Box, Divider } from "@mui/material";
import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import { HomeMusics, ArtistListData } from '../data'
import Contact from "./Contact";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { motion } from "framer-motion";


const ArtistList = ({ Artist }) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const loadMore = () => setVisibleCount((prev) => prev + 9);
  const visibleArtists = Artist.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-start w-full mb-4">
      <div className="flex flex-row gap-4 overflow-x-auto flex-nowrap w-full px-4">
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
        <div className="text-4xl font1 flex flex-row justify-center items-center text-neutral-600 md:mx-4 mb-4">Popular Musics</div>
        <div className="flex flex-row overflow-x-auto no-scrollbar space-x-4 pl-10 py-2 w-full">
          {HomeMusics.map((video, index) => (
            <div
              key={index}
              className="min-w-[250px] md:min-w-[300px] overflow-hidden  flex flex-row items-center"
            >
              <Link to={`/videoSection/${video.id}`} className="w-full flex flex-row ">
                <div className="flex flex-col justify-between items-center bg-[#f5dfc9] min-h-[200px] border-r-0 border-2 border-gray-300 md:px-5">
                  <div className="flex flex-col items-center">
                  <div className="text-lg font-semibold text-center">{video.title}</div>
                  <span className="text-sm text-gray-500 font7 truncate whitespace-nowrap overflow-hidden w-full text-center">
                    {video.artist}
                  </span>
                  </div>
                  <div className="flex flex-row items-center md:my-4">
                    <SkipPreviousIcon className="text-gray-500 hover:text-gray-700 md:ml-3" />
                    <PlayArrowIcon className="text-gray-500 hover:text-gray-700 md:ml-3" />
                    <SkipNextIcon className="text-gray-500 hover:text-gray-700 md:ml-3" />
                  </div>
                </div>
                <img src={video.thumbnail} alt="Cover" className="w-full h-auto object-cover " />

              </Link>
            </div>
          ))}
        </div>
      </div>
      </motion.div>


      {/* Artist Section */}
      <div className="mt-8">
        <div className="text-4xl font1 flex flex-row justify-center items-center text-neutral-600 md:mx-4 mb-4">Famous Artists</div>
        <ArtistList Artist={ArtistListData} />
      </div>
      <Divider orientation="horizontal" flexItem variant="middle" />
      <Contact />
    </div>
  );
}


export default Home
