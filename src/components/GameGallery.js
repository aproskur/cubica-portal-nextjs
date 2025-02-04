"use client"
import React from "react";
import styled from "styled-components";
import GameCard from "./GameCard";

const GalleryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
  flex-grow: 1;
  padding: 1.5em 1em;

   /* Is needed if menu is sticky */
  @media(max-width: 768px ){
  padding: 110px 5px;
  }
`;

const GameGallery = ({ games }) => {
    return (
        <GalleryWrapper>
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </GalleryWrapper>
    );
};

export default GameGallery;
