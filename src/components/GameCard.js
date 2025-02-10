"use client";

import Link from "next/link";
import styled from "styled-components";
import SquareIcon from "./SquareIcon";
import { CiHeart } from "react-icons/ci";
import { LuShoppingCart } from "react-icons/lu";
import { FaStar } from "react-icons/fa";


const CardWrapper = styled.div`
position: relative; /* ! fixed star appering somewhere on the top left where logo */
  background-color: inherit;
  border-radius: 5px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

const TopLeftBadge = styled.div`
  position: absolute;
  top: 25px;
  left: 16px;
  background-color: rgba(var(--theme-grey), 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .4rem 1rem;
  font-size: 1rem;
  gap: 4px;
  z-index: 2; 
`;

const TopRightBadge = styled.div`
  position: absolute;
  top: 25px;
  right: 15px;
  background-color: rgba(var(--theme-grey), 0.6);
  color: #fff;
  padding: .4rem 1rem;
  font-size: 1rem;
  z-index: 2; 
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 12px;
  cursor: pointer;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PriceContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const PriceText = styled.span`
  font-size: 0.9rem;
`;

const PriceValue = styled.span`
  color: rgb(var(--theme-yellow));
  font-weight: bold;
`;

const PriceLabel = styled.span`
  color: rgb(var(--theme-grey));
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameName = styled.h3`
  font-size: 1rem;
  color: #fff;
  margin: 0;
  cursor: pointer;
`;

const FooterIcon = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
`;

const GameCard = ({ game }) => {
  return (
    <CardWrapper>
      {/* top left badge (rating) */}
      <TopLeftBadge>
        <FaStar color="white" />
        {game.rating}
      </TopLeftBadge>

      {/* top right badge (total reviews) */}
      <TopRightBadge>{game.reviews}</TopRightBadge>

      {/* Link the image to the game page */}
      <Link href={`/games/${game.slug}`}>
        <CardImage src={game.image} alt={game.title} />
      </Link>

      {/* Cart Icon and Prices */}
      <CardContent>
        <SquareIcon icon={<LuShoppingCart />} />
        <PriceContainer>
          <PriceText>
            <PriceValue>{game.pricePerLaunch}</PriceValue>
            <PriceLabel> ₽/запуск</PriceLabel>
          </PriceText>
          <PriceText>
            <PriceValue>{game.pricePerMonth}</PriceValue>
            <PriceLabel> ₽/месяц</PriceLabel>
          </PriceText>
        </PriceContainer>
      </CardContent>

      {/* Footer with Linkable Game Name */}
      <Footer>
        <FooterIcon>
          <SquareIcon icon={<CiHeart />} $variant="fill" />
        </FooterIcon>
        <Link href={`/games/${game.slug}`}>
          <GameName>{game.title}</GameName>
        </Link>
      </Footer>
    </CardWrapper>
  );
};

export default GameCard;
