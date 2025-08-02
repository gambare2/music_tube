import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HomeMusics } from "../data";
import { Divider } from "@mui/material";
import { useLiked } from "../../shared/context/Likedcontext";
import { useSaved } from "../../shared/context/Savedcontext";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../shared/store/Store";
import { addToPlaylist, removeFromPlaylist, createPlaylist } from '../../shared/slice/PlaylistSlice'
import { toast } from "react-toastify";

type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
};

const VideoSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const video = HomeMusics.find((v) => v.id === parseInt(id || "", 10));

  const dispatch = useDispatch();
  const playlists = useSelector((state: RootState) => state.playlist.playlists);

  const { savedSongs, savedMusic } = useSaved();
  const { likedSongs, likedMusic } = useLiked();

  if (!video) {
    return (
      <div className="text-center mt-10 text-red-500 text-xl font-semibold">
        Video not found
      </div>
    );
  }

  const isLiked = likedMusic(video.id);
  const isSaved = savedMusic(video.id);

  const currentPlaylist = playlists.find((p) =>
    p.videos.some((v) => v.id === video.id)
  );
  const isInPlaylist = Boolean(currentPlaylist);

  const handlePlaylistToggle = () => {
    const current = playlists.find((p) => p.videos.some((v) => v.id === video.id));

    if (current) {
      dispatch(removeFromPlaylist({ playlistId: current.id, videoId: video.id }));
      toast.info("Removed from playlist");
    } else {
      if (playlists.length > 0) {
        dispatch(addToPlaylist({ playlistId: playlists[0].id, video }));
        toast.success("Added to playlist");
      } else {
        dispatch(createPlaylist({ name: "My First Playlist" }));
        toast.success("Playlist created and video added");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8 px-4">
      <VideoTitle title={video.title} />

      <div className="w-full md:mt-4 max-w-xl aspect-video bg-slate-300">
        <iframe
          className="w-full h-full rounded-md"
          src={video.videoUrl.replace("watch?v=", "embed/")}
          title={video.title}
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      <VideoDetails
        video={video}
        isLiked={isLiked}
        isSaved={isSaved}
        isInPlaylist={isInPlaylist}
        onLike={() => likedSongs(video)}
        onSave={() => savedSongs(video)}
        onPlaylistToggle={handlePlaylistToggle}
      />
    </div>
  );
};

const VideoTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center w-full max-w-xl">
    <div className="text-2xl font-bold mb-2 text-neutral-600 text-center">{title}</div>
    <Divider className="bg-slate-300 w-full" />
  </div>
);

const VideoDetails: React.FC<{
  video: Video;
  isLiked: boolean;
  isSaved: boolean;
  isInPlaylist: boolean;
  onLike: () => void;
  onSave: () => void;
  onPlaylistToggle: () => void;
}> = ({ video, isLiked, isSaved, isInPlaylist, onLike, onSave, onPlaylistToggle }) => (
  <div className="w-full max-w-xl bg-slate-100 p-4 rounded-md shadow-md mt-6">
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="flex flex-col text-neutral-700 w-full">
        <h3 className="text-xl font-bold mb-1">{video.title}</h3>
        <VideoDescription text={video.description} />
      </div>

      <div className="flex gap-3 self-center sm:self-start">
        <IconButton
          onClick={onLike}
          src={isLiked ? "/Like-filled.svg" : "/Like-border.svg"}
          alt="Like"
        />
        <IconButton
          onClick={onSave}
          src={isSaved ? "/save-filled.svg" : "/save-empty.svg"}
          alt="Save"
        />
        <IconButton
          onClick={onPlaylistToggle}
          src={isInPlaylist ? "/playlist_check.svg" : "/playlist_add.svg"}
          alt="Playlist"
        />
      </div>
    </div>
  </div>
);

const IconButton: React.FC<{ onClick: () => void; src: string; alt: string }> = ({
  onClick,
  src,
  alt,
}) => (
  <button onClick={onClick} className="transition-transform hover:scale-105">
    <img src={src} alt={alt} className="w-8 h-8" />
  </button>
);

const VideoDescription: React.FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > 60;

  return (
    <div className="w-full">
      <p
        className={`text-sm text-gray-700 ${!expanded && "truncate whitespace-nowrap overflow-hidden"}`}
      >
        {text}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-blue-600 text-xs font-medium mt-1 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default VideoSection;

