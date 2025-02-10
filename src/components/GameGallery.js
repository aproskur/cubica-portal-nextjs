"use client"
import React from "react";
import styled from "styled-components";
import GameCard from "./GameCard";

const GalleryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
  flex-grow: 1;
  padding: 1.5em 1em;
  min-width: 0; /* Prevents overflow issues */


   
  @media(max-width: 875px ){
  
  padding: 110px 5px; /* Is needed if menu is sticky */
   grid-template-columns: repeat(2, minmax(300px, 1fr));
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

const GameGallery = ({ games, searchQuery }) => {


    // Filter games based on search query
    const filteredGames = games.filter((game) =>
        game.title.toLowerCase().includes(searchQuery)
    );

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
