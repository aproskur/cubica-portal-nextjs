"use client";
import GameGallery from "@/components/GameGallery";
import MobileFooter from "@/components/MobileFooter";
import MobileAside from "@/components/MobileAside";
import { useState, useEffect } from "react";
import { useSearch } from "@/context/SearchContext";
import { fetchGames } from "@/utils/apiService";

export default function Home() {
  const { searchQuery } = useSearch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <main className="main">
      {loading && <p>Loading games...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <GameGallery games={games} searchQuery={searchQuery} />}
      <MobileFooter openFilter={() => setIsFilterOpen(true)} />
      <MobileAside isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </main>
  );
}
