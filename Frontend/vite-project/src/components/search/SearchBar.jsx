import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";

const SearchBar = ({ setSearchSongs }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. If query is empty, clear results and don't fetch
    if (!query.trim()) {
      setSearchSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs/search`,
          // Use 'query' here, NOT 'value'
          { params: { query: query } } 
        );

        setSearchSongs(res.data.results || []);
      } catch (error) {
        console.error("Jamendo search failed", error);
        setSearchSongs([]);
      } finally {
        setLoading(false);
      }
    };

    // 2. Debounce logic: wait 400ms after the user stops typing
    const debounceTimer = setTimeout(() => {
      fetchSongs();
    }, 400);

    // 3. Cleanup function: clear the timer if the user types again
    return () => clearTimeout(debounceTimer);
    
  }, [query, setSearchSongs]); // Dependency array is correct now

  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
          type="text"
          className="searchbar-input"
          placeholder="Search Songs....."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <CiSearch className="searchbar-icon" size={20} />
      </div>
      
      {!query && !loading && (
        <p className="searchbar-empty">Search Songs to display</p>
      )}
      
      {loading && <p className="searchbar-loading">Searching...</p>}

      {query && !loading && setSearchSongs.length === 0 && (
        <p className="searchbar-empty">No songs found for "{query}"</p>
      )}
    </div>
  );
};

export default SearchBar;