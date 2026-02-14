import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "../../css/footer/ControlArea.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, updateFavourites, logout } from "../../redux/slices/authSlice";

// 1. Keep this here OR import it, but DON'T do both. 
// I'll leave the local version so it definitely works right now.
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const ControlArea = ({playerState, playerControls}) => {
  const dispatch = useDispatch();
  const {user, isAuthenticated, token } = useSelector((state)=> state.auth);
  
  const {
    isPlaying = false, 
    currentTime = 0, 
    duration = 0, 
    currentSong = null, 
    isLoading = false
  } = playerState || {};

  const {
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek
  } = playerControls || {};

  const isLiked = Boolean(
    user?.favourites?.some((fav) => 
      String(fav.id || fav._id) === String(currentSong?.id || currentSong?._id)
    )
  );

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please login to add favourites");
      return;
    }
    if (!currentSong) return;

    try {
      const songData = {
        id: currentSong.id || currentSong._id, 
        name: currentSong.name,
        artist_name: currentSong.artist_name,
        image: currentSong.image,
        duration: currentSong.duration,
        audio: currentSong.audio,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song: songData },
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        }
      );

      if (res.data.user) {
        dispatch(setUser({ 
          user: res.data.user, 
          token: token 
        }));
      } else if (res.data.favourites || Array.isArray(res.data)) {
        const updatedFavs = res.data.favourites || res.data;
        dispatch(updateFavourites(updatedFavs));
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Like Action Failed:", errorMsg);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        dispatch(logout());
      }
    }
  };

  return (
    <div className="control-root">
      <div className="control-buttons">
        <button type="button" className="control-icon-btn" onClick={() => handlePrev?.()}>
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>
        
        <button type="button" className="control-play-btn" onClick={() => handleTogglePlay?.()}>
          {isLoading ? (
            <ImSpinner2 className="animate-spin" color="#a855f7" size={36} />
          ) : isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          ) } 
        </button>

        <button type="button" className="control-icon-btn" onClick={() => handleNext?.()}>
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>

        {isAuthenticated && (
          <button type="button" className="control-icon-btn" onClick={handleLike}>
            {isLiked ? <FaHeart color="#ff3c3c" size={22}/> : <FaRegHeart color="#a855f7" size={22} />}
          </button>
        )}
      </div>

      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime || 0}
          className="control-progress"
          onChange={e => handleSeek?.(Number(e.target.value))}
          style={{
            // Dynamic purple track that follows the thumb
            background: `linear-gradient(to right, #a855f7 ${duration ? (currentTime/duration)* 100 : 0}%, #333 ${duration ? (currentTime / duration)*100 : 0}%)`,
          }}
        />
        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;