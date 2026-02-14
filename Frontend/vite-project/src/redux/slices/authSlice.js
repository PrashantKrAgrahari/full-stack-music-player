import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"), // Better initial check
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },

    setUser: (state, action) => {
      // Logic for both Login (payload.user) and Profile updates (payload alone)
      const userData = action.payload.user || action.payload;
      const tokenData = action.payload.token || state.token;

      state.user = userData;
      state.token = tokenData;
      state.isAuthenticated = !!userData;
      state.isLoading = false;
      state.error = null;

      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    // FIX: Make this robust enough to handle the full response or just the array
    updateFavourites: (state, action) => {
      if (state.user) {
        // If the backend sends { user: { favourites: [...] } }
        if (action.payload.user?.favourites) {
          state.user.favourites = action.payload.user.favourites;
        } 
        // If the backend sends just the array [...]
        else if (Array.isArray(action.payload)) {
          state.user.favourites = action.payload;
        }
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setUser,
  setError,
  logout,
  clearError,
  updateFavourites,
} = authSlice.actions;

export default authSlice.reducer;