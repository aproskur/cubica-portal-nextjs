"use client"
import React from "react";
import styled from "styled-components";
import GameCard from "./GameCard";
import { useSearch } from "@/context/SearchContext";

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

const GameGallery = ({ games = [] }) => {
    const { searchQuery } = useSearch();

    console.log("GameGallery - Image URLs:", games.map(game => game.image));


    // Ensure games is an array before filtering
    const filteredGames = games.map((game) => {
        console.log("Before Processing:", game);
        console.log("Game Image Object:", game.image); // Debugging

        let imageUrl = FALLBACK_IMAGE; // Default fallback image

        if (game.image && typeof game.image === "object" && game.image.url) {
            // Ensure we prepend API_URL if the URL is relative
            imageUrl = game.image.url.startsWith("/") ? `${API_URL}${game.image.url}` : game.image.url;
        } else if (typeof game.image === "string") {
            // If the image is a string (not an object), handle it correctly
            imageUrl = game.image.startsWith("/") ? `${API_URL}${game.image}` : game.image;
        } else {
            console.warn(`Game ID ${game.id} has an invalid image format:`, game.image);
        }

        return {
            ...game,
            image: imageUrl,
        };
    });


    console.log("Final Processed Games Array:", filteredGames);




    return (
        <GalleryWrapper>
            {filteredGames.length > 0 ? (
                filteredGames.map((game) => <GameCard key={game.id} game={game} />)
            ) : (
                <NoResults>Игр не найдено</NoResults>
            )}
        </GalleryWrapper>
    );
};

export default GameGallery;