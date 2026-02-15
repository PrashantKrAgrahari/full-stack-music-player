import React from "react";
import { IoIosSettings } from "react-icons/io";
import logo from "../../assets/music.png";
import "../../css/sidemenu/SideMenu.css";
import { CiUser } from "react-icons/ci";
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";
import { MdOutlineLibraryMusic } from "react-icons/md"; 
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../redux/slices/uiSlices";

const SideMenu = ({ setView, view, onOpenEditProfile, toggleMenu }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const displayUser = {
    name: user?.name || "Guest",
    avatar: user?.avatar || "",
  };

  const handleNavigation = (targetView, action = null) => {
    // Check authentication for protected views
    if (action === "search" || action === "favourite" || action === "library") {
      if (!isAuthenticated) {
        dispatch(openAuthModal("login"));
        if (window.innerWidth <= 768 && toggleMenu) toggleMenu();
        return;
      }
    }

    if (targetView) setView(targetView);
    
    // Auto-close sidebar on mobile after clicking
    if (window.innerWidth <= 768 && toggleMenu) {
      toggleMenu();
    }
  };

  const getNavBtnClass = (item) =>
    `sidemenu-nav-btn ${view === item ? "active" : ""}`;

  return (
    <>
      <aside className="sidemenu-root">
        {/* Logo */}
        <div className="sidemenu-header">
          <img src={logo} alt="music-logo" className="sidemenu-logo-img" />
          <h2 className="sidemenu-logo-title">Raag</h2>
        </div>

        {/* Navigation */}
        <nav className="sidemenu-nav" aria-label="Main navigation">
          <ul className="sidemenu-nav-list">
            <li>
              <button
                className={getNavBtnClass("home")}
                onClick={() => handleNavigation("home")}
              >
                <AiOutlineHome className="sidemenu-nav-icon" size={18} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                className={getNavBtnClass("search")}
                onClick={() => handleNavigation("search", "search")}
              >
                <AiOutlineSearch className="sidemenu-nav-icon" size={18} />
                <span>Search</span>
              </button>
            </li>

            {/* Library / Playlists Section (Mobile Only) */}
            <li className="mobile-only-nav">
              <button 
                className={`${getNavBtnClass("library")} mobile-only-nav`}
                onClick={() => handleNavigation("library", "library")}
              >
                <MdOutlineLibraryMusic className="sidemenu-nav-icon" size={18} />
                <span>Library</span>
              </button>
            </li>

            <li>
              <button
                className={getNavBtnClass("favourite")}
                onClick={() => handleNavigation("favourite", "favourite")}
              >
                <AiOutlineHeart className="sidemenu-nav-icon" size={18} />
                <span>Favourite</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex-1"></div>

        {/* Profile Row */}
        <div className="sidemenu-profile-row">
          <div className="profile-placeholder">
            <CiUser size={30} />
          </div>

          <div className="sidemenu-username-wrapper">
            <div className="sidemenu-username">{displayUser.name}</div>
          </div>

          {isAuthenticated && (
            <div className="settings-container">
              <button 
                type="button" 
                className="sidemenu-settings-btn" 
                onClick={() => {
                  onOpenEditProfile();
                  if (window.innerWidth <= 768 && toggleMenu) toggleMenu();
                }}
              >
                <IoIosSettings size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideMenu;