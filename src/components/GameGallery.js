"use client"
import React from "react";
import styled from "styled-components";
import GameCard from "./GameCard";
import { useFilters } from "@/context/FiltersContext";
import { useAuth } from "@/context/AuthContext";
import { useGamesData } from "@/context/GamesDataContext";
import { useEffect, useState, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const FALLBACK_IMAGE = "/assets/images/antarctika.webp";

const GalleryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
  flex-grow: 1;
  padding: 1.5em 1em;
  min-width: 0; /* Prevents overflow issues */


   
  @media(max-width: 875px ){
  
   grid-template-columns: repeat(2, minmax(300px, 1fr));
   margin-bottom: 3rem; /* only if there is sticky footer */
  }

    @media(max-width: 500px ){
   grid-template-columns: repeat(1, minmax(300px, 1fr));
  }
`;


const NoResults = styled.p`
  font-size: 18px;
  text-align: center;
  color: rgba(var(--theme-grey), 0.7);
`;

const GameGallery = () => {
    const { filters, updateFilters } = useFilters();
    const { user } = useAuth();

    const { games } = useGamesData();

    console.log("GameGallery - Image URLs:", games.map(game => game.image));

    console.log("Rendering GameGallery with games:", games.map(g => g.title));

    const processedGames = games.map((game) => {
        let imageUrl = FALLBACK_IMAGE;

        if (typeof game.image === "object" && game.image.url) {
            imageUrl = game.image.url.startsWith("/") ? `${API_URL}${game.image.url}` : game.image.url;
        } else if (typeof game.image === "string") {
            imageUrl = game.image.startsWith("/") ? `${API_URL}${game.image}` : game.image;
        }

        // Only clone if image changed
        if (game.image !== imageUrl) {
            return { ...game, image: imageUrl };
        }

        return game;
    });




    const filteredGames = processedGames.filter((game) => {
        // 1. Hide unpublished games if user is NOT the developer
        if (!game.is_published && game.developed_by?.id !== user?.id) return false;

        // 2. If onlyMyDevelopedGame is active, filter to developer's games only
        if (filters.onlyMyDevelopedGames && game.developed_by?.id !== user?.id) return false;

        // 3. Apply search filter
        if (
            filters.searchQuery &&
            !game.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ) return false;
        
        // 4. Filter by selected competencies

        console.log(`🔍 Game: ${game.title}`);
        console.log("Game competencies:", game.competencies?.map(c => c.id));
        console.log("Selected filters:", filters.competencies);

if (
    filters.competencies.length > 0 &&
    !game.competencies?.some((c) => filters.competencies.includes(c.documentId))
  ) {
    return false;
  }

        return true;
    });


    console.log("🧠 Current filters:", filters);



    return (
        <GalleryWrapper>
            {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                    <GameCard key={game.documentId} game={game} />
                ))
            ) : (
                <NoResults>Игр не найдено</NoResults>
            )}
        </GalleryWrapper>
    );
};

export default GameGallery;