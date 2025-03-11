import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgb(var(--theme-grey));
  border-radius: 5px;
  background-color: inherit;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    ${({ $iconType, $color, $isFavorite }) =>
    $isFavorite
      ? `fill: ${$color}; stroke: ${$color};` // Override fill and stroke if favorite
      : $iconType === "fill"
        ? `fill: ${$color}; stroke: none;` // Keep fill logic for other icons
        : `fill: none; stroke: ${$color}; stroke-width: 1.5;`}; // Default stroke logic
  }

  &:hover {
    border: 1px solid rgba(var(--theme-yellow), 0.7);
    svg {
      fill: ${({ $isFavorite }) => ($isFavorite ? "#fff" : "rgba(var(--theme-yellow), 0.7)")}; /* Change on hover */
      stroke: #ffffff;
    }
  }

`;


const SquareIcon = ({ icon, iconType = "stroke", color = "rgb(var(--theme-grey))", onClick, isFavourite = false }) => {
  return <IconWrapper onClick={onClick} $iconType={iconType} $color={color}>{icon}</IconWrapper>;
};


export default SquareIcon;


