import React, { useEffect, useState } from "react"; // Added useState
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { clearError, logout, setError, setLoading, setUser } from "./redux/slices/authSlice";
import axios from "axios";

import Signup from "./components/auth/Signup";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
   const dispatch = useDispatch();
   const {token, user} = useSelector((state) => state.auth);
   
   // --- MOBILE MENU STATE ---
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

   useEffect(()=> {
     const storedToken = token || localStorage.getItem("token");
     if(!storedToken || user) return;

     const fetchUser = async () => {
      try {
        dispatch(setLoading(true))
        dispatch(clearError());

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,{
            headers:{
              Authorization: `Bearer ${storedToken}`,
            },
          }
        )
        dispatch(setUser({user: res.data, token: storedToken}))
      } catch (error) {
        console.error("getMe failed", error)
        dispatch(logout())
        dispatch(setError(error?.response?.data?.message || "Session expired. Please login again",))
      } finally {
        dispatch(setLoading(false))
      }
     }
     fetchUser();
   },[dispatch, token, user]);

  return (
    <BrowserRouter>
      {/* --- MOBILE HAMBURGER BUTTON --- */}
      {/* This button stays fixed so you can always open the menu */}
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* --- OVERLAY --- */}
      {/* Dimmed background when menu is open */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <Routes>
        {/* Pass state to Homepage so it can tell SideMenu to slide in */}
        <Route 
          path="/" 
          element={<Homepage isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />} 
        /> 
        <Route path ="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;