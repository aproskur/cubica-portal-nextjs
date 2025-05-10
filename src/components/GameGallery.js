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

    const sortKeyMap = {
        alphabet: "title",
        popularity: "rating",
        rating: "rating",
        duration: "durationMinutes",
        price: "pricePerDay",
        date: "publishedAt",
      };
      
console.log("games", games);

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




    const finalGames = useMemo(() => {
        const filtered = processedGames.filter((game) => {
          if (!game.is_published && game.developed_by?.id !== user?.id) return false;
          if (filters.onlyMyDevelopedGames && game.developed_by?.id !== user?.id) return false;
          if (
            filters.searchQuery &&
            !game.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
          ) return false;
          if (
            filters.competencies.length > 0 &&
            !game.competencies?.some((c) => filters.competencies.includes(c.documentId))
          ) return false;
      
          return true;
        });
      
        const sortField = sortKeyMap[filters.sort];
        const direction = filters.sortOrder === "desc" ? -1 : 1;
      
        const sorted = sortField
          ? [...filtered].sort((a, b) => {
              let aVal = a[sortField];
              let bVal = b[sortField];
      
              if (aVal === undefined || bVal === undefined) return 0;
      
              if (typeof aVal === "string") aVal = aVal.toLowerCase();
              if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
              if (aVal > bVal) return direction;
              if (aVal < bVal) return -direction;
              return 0;
            })
          : filtered;
      
        return sorted;
      }, [processedGames, filters, user]);
      


      return (
        <GalleryWrapper>
          {finalGames.length > 0 ? (
            finalGames.map((game) => (
              <GameCard key={game.documentId} game={game} />
            ))
          ) : (
            <NoResults>Игр не найдено</NoResults>
          )}
        </GalleryWrapper>
      );
      
};

export default GameGallery;