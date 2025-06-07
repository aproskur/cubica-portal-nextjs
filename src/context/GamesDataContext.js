// Adding this context to control rendering of some Links in menus and header,
// that depend on user's data.Like rendering "Мои покупки" if user has purchased games.

'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { fetchGames, fetchUserPurchases } from '@/utils/apiService';
import { useAuth } from './AuthContext';
import { useFilters } from './FiltersContext';

//  Safe default values
export const GamesDataContext = createContext({
  purchasedGames: [],
  setPurchasedGames: () => {},
  refreshPurchasedGames: () => {},
});

export const GamesDataProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedGames, setPurchasedGames] = useState([]);

  const { isAuthenticated, user, token } = useAuth();
  const { filters, updateFilters } = useFilters();

  // Dynamic fetch when filters or user change
  useEffect(() => {
    // Fix: if user logged out, but dev-only filter is still on - reset it
    if (filters.onlyMyDevelopedGames && !user) {
      updateFilters({ onlyMyDevelopedGames: false });
      return;
    }

    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch with filters and user ( TODO need to modify fetchGames)
        const data = await fetchGames({ filters, user });
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

  const fetchAndSetPurchasedGames = async () => {
    if (!isAuthenticated && !user) return;
    try {
      const purchases = await fetchUserPurchases(token);
      setPurchasedGames(purchases || []);
    } catch (err) {
      console.error('Error fetching user purchases:', err);
    }
  };

  const updateGameInList = (updatedGame) => {
    setGames((prevGames) => {
      return prevGames.map((g) => {
        const match = g.documentId === updatedGame.documentId;
        return match ? { ...g, ...updatedGame } : g;
      });
    });
  };

  useEffect(() => {
    fetchAndSetPurchasedGames();
  }, [isAuthenticated, user, token]);

  return (
    <GamesDataContext.Provider
      value={{
        games,
        loading,
        error,
        purchasedGames,
        setPurchasedGames,
        refreshPurchasedGames: fetchAndSetPurchasedGames,
        updateGameInList,
      }}
    >
      {children}
    </GamesDataContext.Provider>
  );
};

export const useGamesData = () => useContext(GamesDataContext);
