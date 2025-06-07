'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { fetchGames, fetchUserPurchases } from '@/utils/apiService';
import { useAuth } from './AuthContext';
import { useFilters } from './FiltersContext';

// Create the context without a default value to avoid accidental usage outside of the provider.
export const GamesDataContext = createContext(null);

/**
 * GamesDataProvider
 *
 * This provider wraps the part of the app that needs access to:
 * - All games (optionally filtered)
 * - Current selected game (used across multiple components like Aside, Tabs, InfoContainer)
 * - User's purchased games
 *
 * It centralizes game-related state and provides updater functions.
 */
export const GamesDataProvider = ({ children }) => {
  // Global state
  const [games, setGames] = useState([]); // All games list
  const [loading, setLoading] = useState(true); // Loading state for fetch
  const [error, setError] = useState(null); // Error state
  const [purchasedGames, setPurchasedGames] = useState([]); // Games purchased by the user
  const [currentGame, setCurrentGame] = useState(null); // Currently opened game (detailed view)

  const { isAuthenticated, user, token } = useAuth(); // Auth context
  const { filters, updateFilters } = useFilters(); // Filters context

  /**
   * Load games list when filters or user info changes.
   * Automatically resets dev-only filter if user is not logged in anymore.
   */
  useEffect(() => {
    if (filters.onlyMyDevelopedGames && !user) {
      updateFilters({ onlyMyDevelopedGames: false });
      return;
    }

    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGames({ filters, user }); // API call with filters
        setGames(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load games. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [filters, user]);

  /**
   * Load list of purchased games if user is authenticated.
   * This is used to determine which games should show a "Мои покупки" badge or unlock content.
   */
  const fetchAndSetPurchasedGames = async () => {
    if (!isAuthenticated && !user) return;
    try {
      const purchases = await fetchUserPurchases(token);
      setPurchasedGames(purchases || []);
    } catch (err) {
      console.error('Error fetching user purchases:', err);
    }
  };

  // Run once after login to get purchased games
  useEffect(() => {
    fetchAndSetPurchasedGames();
  }, [isAuthenticated, user, token]);

  /**
   * Updates one specific game in the global list (after save or edit).
   * Preserves all other games and merges fields.
   */
  const updateGameInList = (updatedGame) => {
    setGames((prevGames) =>
      prevGames.map((g) => (g.documentId === updatedGame.documentId ? { ...g, ...updatedGame } : g))
    );
  };

  // Provide all values and updaters to consumers
  return (
    <GamesDataContext.Provider
      value={{
        games,
        loading, // fetch state
        error, // fetch error
        purchasedGames, // user's purchased games
        currentGame, // selected game (for game page, aside, tabs)
        setPurchasedGames,
        refreshPurchasedGames: fetchAndSetPurchasedGames,
        updateGameInList,
        setCurrentGame, // used for setting/resetting current game
      }}
    >
      {children}
    </GamesDataContext.Provider>
  );
};

/**
 * Custom hook to access GamesDataContext.
 * Ensures it’s only used inside a provider.
 */
export const useGamesData = () => {
  const context = useContext(GamesDataContext);
  if (!context) {
    throw new Error('useGamesData must be used within a GamesDataProvider');
  }
  return context;
};
