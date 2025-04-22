"use client";
import GameGallery from "@/components/GameGallery";
import MobileFooter from "@/components/MobileFooter";
import MobileAside from "@/components/MobileAside";
import { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { useGamesData } from "@/context/GamesDataContext";

export default function Home() {
  const { searchQuery } = useSearch();
  const { games, loading, error } = useGamesData();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <main className="main">
      {loading && <p>Игры загружаются...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <GameGallery searchQuery={searchQuery} />}
      <MobileFooter openFilter={() => setIsFilterOpen(true)} />
      <MobileAside isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </main>
  );
}
