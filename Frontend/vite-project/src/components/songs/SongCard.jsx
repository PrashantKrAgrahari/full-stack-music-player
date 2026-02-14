import React from 'react';
import { AiFillHeart } from "react-icons/ai"; 
import "../../css/songs/SongCard.css";

const SongCard = ({ song, onSelectFavourite, onPlaySong }) => {
  
  const handleRemoveClick = (e) => {
    // Stops the "Play" action from firing when you only want to remove
    e.stopPropagation(); 
    onSelectFavourite?.(song); 
  };

  return (
    <div className="song-card" onClick={() => onPlaySong?.(song)}>
        <div className="song-card-image">
            <img src={song.image} alt={song.name} loading='lazy' />
            
            <button 
              type="button"
              className="remove-favourite-overlay" 
              onClick={handleRemoveClick}
              title="Remove from Favourites"
            >
                <AiFillHeart color="#ff4d4d" size={22} />
            </button>
        </div>

        <div className="song-card-info">
            <h4 className="song-title">{song.name}</h4>
            <p className="song-artist">{song.artist_name}</p>
        </div>
    </div>
  );
};

export default SongCard;