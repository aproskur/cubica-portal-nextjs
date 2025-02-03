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
