import React from "react";
import Auth from "../auth/Auth";
import Playlist from "../player/Playlist";
import SearchBar from "../search/SearchBar";
import SongList from "../player/SongList";
import SongGrid from "../songs/SongGrid";
import "../../css/mainArea/MainArea.css";

const MainArea = ({ view, currentIndex, onSelectSong, onSelectFavourite, onSelectTag, songsToDisplay, setSearchSongs }) => {
  return (
    <div className="mainarea-root">
      <div className="mainarea-top">
        {/* Auth now handles both Buttons (Guest) and User Name (Authenticated) */}
        <Auth />
        
        {/* We show Playlist for both Home and Library. CSS will hide it on mobile-home. */}
        {(view === "home" || view === "library") && (
          <div className={view === "home" ? "home-playlist-wrapper" : "library-playlist-wrapper"}>
            <Playlist onSelectTag={onSelectTag} />
          </div>
        )}
        
        {view === "search" && <SearchBar setSearchSongs={setSearchSongs} />}
      </div>

      <div className="mainarea-scroll">
        {(view === "home" || view === "search") && (
          <SongList 
            songs={songsToDisplay} 
            onSelectSong={onSelectSong} 
            currentIndex={currentIndex} 
          />
        )}

        {view === "favourite" && (
          <SongGrid 
            songs={songsToDisplay} 
            onSelectFavourite={onSelectFavourite} 
            onSelectSong={(index) => onSelectSong(index)} 
          />
        )}
      </div>
    </div>
  );
};

export default MainArea