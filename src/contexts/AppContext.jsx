import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [playlist, setPlaylist] = useState(() => {
        const saved = localStorage.getItem("playlist");
        return saved ? JSON.parse(saved) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("playlist", JSON.stringify(playlist));
    }, [playlist]);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToPlaylist = (item) => {
        if (!playlist.find((p) => p.id === item.id)) {
            setPlaylist([...playlist, item]);
        }
    };

    const removeFromPlaylist = (id) => {
        setPlaylist(playlist.filter((p) => p.id !== id));
    };

    const toggleFavorite = (item) => {
        if (favorites.find((f) => f.id === item.id)) {
            setFavorites(favorites.filter((f) => f.id !== item.id));
        } else {
            setFavorites([...favorites, item]);
        }
    };

    const isFavorite = (id) => {
        return !!favorites.find((f) => f.id === id);
    };

    return (
        <AppContext.Provider
            value={{
                playlist,
                favorites,
                addToPlaylist,
                removeFromPlaylist,
                toggleFavorite,
                isFavorite,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
