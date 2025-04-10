// Adding this context to control rendering of some Links in menus and header, 
// that depend on user's data.Like rendering "Мои покупки" if user has purchased games.

"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { fetchGames, fetchUserPurchases } from "@/utils/apiService"; // Import your fetch function
import { useAuth } from "./AuthContext";

export const GamesDataContext = createContext({
    purchasedGames: [],
    setPurchasedGames: () => { },
    refreshPurchasedGames: () => { },
});


export const GamesDataProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasedGames, setPurchasedGames] = useState([]);

    const { isAuthenticated, user, token } = useAuth();

    useEffect(() => {
        async function loadGames() {
            try {
                const data = await fetchGames();
                setGames(data);
            } catch (err) {
                setError("Failed to load games. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadGames();
    }, []);

    const fetchAndSetPurchasedGames = async () => {
        if (!isAuthenticated && !user) return;
        try {
            const purchases = await fetchUserPurchases(token);
            setPurchasedGames(purchases || []);
            console.log("DATA context, user's purchases", purchases);
        } catch (err) {
            console.error("Error fetching user purchases:", err);
        }
    };


    useEffect(() => {
        fetchAndSetPurchasedGames();
    }, [isAuthenticated, user, token]);


    /*
    useEffect(() => {
        async function loadUsersPurchases() {
            if (!isAuthenticated && !user) return;
            try {
                const purchases = await fetchUserPurchases(token); // Fetch purchased games
                setPurchasedGames(purchases || []);
                console.log("DATA context, user's purchases", purchases)
            } catch (err) {
                console.error("Error fetching user purchases:", err);
            }
        }
        loadUsersPurchases();
    }, [isAuthenticated, user, token]); */

    return (
        <GamesDataContext.Provider value={{ games, loading, error, purchasedGames, setPurchasedGames, refreshPurchasedGames: fetchAndSetPurchasedGames }}>
            {children}
        </GamesDataContext.Provider>
    );
};

export const useGamesData = () => useContext(GamesDataContext);
