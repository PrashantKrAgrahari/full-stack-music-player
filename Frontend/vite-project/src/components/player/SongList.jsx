import React from "react";
import "../../css/mainArea/SongList.css";

// 1. Define the function LOCALLY (Remove any 'import { formatTime }' from the top)
const formatDuration = (totalSeconds) => {
  const seconds = Number(totalSeconds); // Ensure it's a number
  if (!seconds || isNaN(seconds)) return "00:00";
  
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
  
  return `${mm}:${ss}`; 
};

const SongList = ({ songs, onSelectSong, currentIndex }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="songlist-root">
        <div className="songlist-empty">
          <p className="songlist-empty-text">🎵 No songs found</p>
          <span className="songlist-empty-subtext">
            Try searching with a different keyword
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="songlist-root">
      <div className="songlist-scroll">
        <table className="songlist-table">
          <thead>
            <tr>
              <th className="songlist-th">No</th>
              <th className="songlist-th">Name</th>
              <th className="songlist-th">Artist</th>
              <th className="songlist-th">Year</th>
              <th className="songlist-th">Duration</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => {
              // Safety check inside map
              if (!song) return null;

              return (
                <tr 
                  key={song.id || index} 
                  onClick={() => onSelectSong(index)} 
                  className={`songlist-row ${currentIndex === index ? "songlist-row-active" : ""}`}
                >
                  <td className="songlist-td">{index + 1}</td>
                  <td className="songlist-td">{song.name}</td>
                  <td className="songlist-td">{song.artist_name}</td>
                  <td className="songlist-td">
                    {song.releasedate ? song.releasedate.split("-")[0] : "N/A"}
                  </td>
                  {/* USE THE NEW LOCAL FUNCTION HERE */}
                  <td className="songlist-td">
                    {formatDuration(song.duration)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongList;