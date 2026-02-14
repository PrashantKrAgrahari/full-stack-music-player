import axios from "axios";

const CLIENT_ID = "2522e16d";

// Helper to handle Jamendo requests with a timeout
const jamendoRequest = axios.create({
    baseURL: "https://api.jamendo.com/v3.0",
    timeout: 8000, // 8 seconds timeout
});

const getSongs = async (req, res) => {
    try {
        const response = await jamendoRequest.get("/tracks/", {
            params: {
                client_id: CLIENT_ID,
                format: "jsonpretty",
                limit: 15,
                include: "musicinfo", // Recommended for extra metadata
            }
        });
        res.status(200).json(response.data.results);
    } catch (error) {
        console.error("Jamendo Fetch Error:", error.message);
        res.status(500).json({ message: "Could not fetch songs from Jamendo" });
    }
};

const searchSongs = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json({ results: [] });

        const response = await jamendoRequest.get("/tracks/", {
            params: {
                client_id: CLIENT_ID,
                format: "jsonpretty",
                limit: 15,
                namesearch: query,
                order: "relevance"
            }
        });

        res.status(200).json(response.data.results);
    } catch (error) {
        console.error("Search error:", error.message);
        res.status(500).json({ message: "Search failed" });
    }
};

const getPlayListByTag = async (req, res) => {
    try {
        const tag = (req.params.tag || req.query.tag || "").toString().trim();
        if (!tag) return res.status(400).json({ message: "Missing Tag Parameters" });

        const limit = parseInt(req.query.limit ?? "10", 10) || 10;

        const response = await jamendoRequest.get("/tracks/", {
            params: {
                client_id: CLIENT_ID,
                format: "jsonpretty",
                tags: tag,
                limit,
            },
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Tag Fetch Error:", error.message);
        return res.status(500).json({ message: "Failed to fetch by tag" });
    }
};

const toggleFavourite = async (req, res) => {
    try {
        const user = req.user;
        const { song } = req.body;

        if (!song || !song.id) {
            return res.status(400).json({ message: "Song data is required" });
        }

        const index = user.favourites.findIndex(
            (fav) => String(fav.id) === String(song.id)
        );

        if (index !== -1) {
            user.favourites.splice(index, 1);
        } else {
            user.favourites.push(song);
        }

        user.markModified("favourites");
        await user.save();

        return res.status(200).json({
            success: true,
            user: user,
            message: index !== -1 ? "Removed from favourites" : "Added to favourites"
        });

    } catch (error) {
        console.error("Favourite Toggle Error:", error.message);
        return res.status(500).json({ message: "Server error during toggle" });
    }
};

export { getSongs, getPlayListByTag, toggleFavourite, searchSongs };