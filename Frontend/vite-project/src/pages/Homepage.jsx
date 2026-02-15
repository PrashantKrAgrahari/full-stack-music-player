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

// Catch isMenuOpen and toggleMenu props from App.jsx
const Homepage = ({ isMenuOpen, toggleMenu }) => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const songsToDisplay = view === "favourite" 
    ? (auth.user?.favourites || []) 
    : (view === "search" ? searchSongs : songs);

  const { 
    audioRef, currentIndex, currentSong, isPlaying, currentTime, duration, 
    isMuted, loopEnabled, shuffleEnabled, playbackSpeed, volume, 
    playSongatIndex, handleTogglePlay, handleNext, handlePrev, 
    handleTimeUpdate, handleLoadedMetadata, handleEnded, handleToggleMute, 
    handleToggleShuffle, handleToggleLoop, handleChangeSpeed, handleSeek, 
    handleChangeVolume 
  } = useAudioPlayer(songsToDisplay);

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

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentSong) {
        audioRef.current.play().catch((err) => console.warn("Playback blocked:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, audioRef]);

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
    playSongatIndex(index);
    // On mobile, if a song is selected, close the menu to see the player
    if(window.innerWidth <= 768 && isMenuOpen) toggleMenu();
  };

  const loadPlaylist = async (tag) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`);
    
    // 1. Set the songs from the API
    setSongs(res.data.results || []);
    
    // 2. IMPORTANT: Switch view back to 'home' so the song list becomes visible
    setView("home"); 
    
    // 3. Optional: Scroll to top so the user sees the new list
    window.scrollTo(0, 0);

  } catch (err) {
    console.error("Error loading playlist:", err);
  }
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
        {/* Pass the mobile state to SideMenu */}
        <div className={`homepage-sidebar ${isMenuOpen ? "active" : ""}`}>
          <SideMenu 
            setView={setView} 
            view={view} 
            onOpenEditProfile={() => setOpenEditProfile(true)} 
            toggleMenu={toggleMenu} // Pass toggle to close it when links are clicked
          />
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