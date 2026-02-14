import React, { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import "../css/pages/HomePage.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import useAudioPlayer from "../hooks/useAudioPlayer";
import Modal from "../components/common/Modal";
import EditProfile from "../components/auth/EditProfile";
import { setUser } from "../redux/slices/authSlice";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // 1. CRITICAL: Define the list BEFORE passing it to the hook
  const songsToDisplay = view === "favourite" 
    ? (auth.user?.favourites || []) 
    : (view === "search" ? searchSongs : songs);

  // 2. Pass the dynamic list to your hook
  const { 
    audioRef, currentIndex, currentSong, isPlaying, currentTime, duration, 
    isMuted, loopEnabled, shuffleEnabled, playbackSpeed, volume, 
    playSongatIndex, handleTogglePlay, handleNext, handlePrev, 
    handleTimeUpdate, handleLoadedMetadata, handleEnded, handleToggleMute, 
    handleToggleShuffle, handleToggleLoop, handleChangeSpeed, handleSeek, 
    handleChangeVolume 
  } = useAudioPlayer(songsToDisplay);

  // 3. Normalized Favourite Toggle
  const handleToggleFavourite = async (song) => {
    if (!auth.token) return alert("Please login");
    try {
      const songId = song.id || song._id;
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song: { ...song, id: songId } },
        { 
          headers: { Authorization: `Bearer ${auth.token}` },
          withCredentials: true 
        }
      );
      const updatedUser = res.data.user || res.data;
      dispatch(setUser({ user: updatedUser, token: auth.token }));
    } catch (error) {
      console.error("Toggle Error:", error);
    }
  };

  // 4. Playback synchronization effect
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentSong) {
        audioRef.current.play().catch((err) => console.warn("Playback blocked:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, audioRef]);

  // 5. Fetching initial songs
  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs`);
        setSongs(res.data.results || []);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchInitialSongs();
  }, []);

  const handleSelectSong = (index) => {
    console.log("Attempting to play index:", index);
    playSongatIndex(index);
  };

  const loadPlaylist = async (tag) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`);
      setSongs(res.data.results || []);
    } catch (err) { console.error(err); }
  };

  const playerState = { currentSong, isPlaying, currentTime, duration, isMuted, loopEnabled, playbackSpeed, shuffleEnabled, volume };
  const playerControls = { playSongatIndex, handleTogglePlay, handleNext, handlePrev, handleSeek };
  const playerFeatures = { onToggleMute: handleToggleMute, onToggleLoop: handleToggleLoop, onToggleShuffle: handleToggleShuffle, onChangeSpeed: handleChangeSpeed, onChangeVolume: handleChangeVolume, onToggleFavourite: handleToggleFavourite };

  return (
    <div className="homepage-root">
      <audio 
        ref={audioRef} 
        src={currentSong?.audio || ""} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata} 
        onEnded={handleEnded} 
      />
      <div className="homepage-main-wrapper">
        <div className="homepage-sidebar">
          <SideMenu setView={setView} view={view} onOpenEditProfile={() => setOpenEditProfile(true)} />
        </div>
        <div className="homepage-content">
          <MainArea 
            view={view} 
            currentIndex={currentIndex} 
            onSelectSong={handleSelectSong} 
            onSelectFavourite={handleToggleFavourite} 
            onSelectTag={loadPlaylist} 
            songsToDisplay={songsToDisplay} 
            setSearchSongs={setSearchSongs} 
          />
        </div>
      </div>
      <Footer playerState={playerState} playerControls={playerControls} playerFeatures={playerFeatures} />
      {openEditProfile && (
        <Modal onClose={() => setOpenEditProfile(false)}>
          <EditProfile onClose={() => setOpenEditProfile(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Homepage;