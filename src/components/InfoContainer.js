"use client"
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { saveAndUpdateGame } from "@/utils/gameHelpers";

const InfoWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    gap: 10px;
    background-color: inherit;
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); 
`;

const Title = styled.h1`
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
`;

const Reviews = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
`;

const PriceWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: bold;

    span {
        color: rgb(var(--theme-yellow));
    }
`;

const Description = styled.p`
    font-size: 1rem;
    line-height: 1.5;
    color: #ccc; 
`;

const GameDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.9rem;

    span {
        font-weight: bold;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;

    button {
        background-color: inherit;
        border: 1px solid rgb(var(--theme-grey));
        color: rgb(var(--theme-yellow));
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        text-transform: uppercase;
        &:hover {
            border: 1px solid rgb(var(--theme-yellow));
            color: rgb(var(--foreground));
        }

`;

const Delimeter = styled.div`
    width: 100%; 
    height: 1px; 
    background-color: rgba(var(--theme-yellow), 0.5);
    margin: 20px 0; 
`;


const StarsWrapper = styled.div`
  display: flex;
    gap: 5px;
    align-items: center;`;

const PriceInput = styled.input`
  width: 50px;
  padding: 8px;
  font-size: 14px;
  font-family: inherit;
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  border: 1px solid rgba(var(--theme-grey), 0.5);
  border-radius: 4px;
  text-align: right;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }

  &:focus {
    border-color: rgb(var(--theme-yellow));
    box-shadow: 0 0 5px rgba(var(--theme-yellow), 0.5);
  }
`;

const PriceLabelDevmode = styled.div`
  align-self: center;
  font-size: 0.9rem;
  color: rgb(var(--theme-grey));
`;

const PriceEditWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
`;



const Rating = ({ rating }) => {
    return (
        <StarsWrapper>
            {[...Array(5)].map((_, index) => (
                <FaStar key={index} color={index < rating ? "rgb(var(--theme-yellow))" : "#ccc"} />
            ))}
            {rating === 0 && <span>Нет оценки</span>}
        </StarsWrapper>
    );
};


const InfoContainer = ({ game, token, isDeveloper, updateGameInList, onUpdate, onBuyClick }) => {
    const {
        title,
        rating,
        reviews,
        description,
        pricePerLaunch,
        pricePerMonth,
        price_per_day: priceDay,
        genre,
        format,
        duration,
        author,
        details,
    } = game;

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingPrices, setIsEditingPrices] = useState(false);





    const updateField = async (fields, onSuccess) => {
        await saveAndUpdateGame(fields, {
            game,
            token,
            updateGameInList,
            setLocalGame: onUpdate, // passed setGame via onUpdate
            onSuccess
        });
    };



    return (
        <InfoWrapper>
            {isDeveloper && isEditingTitle ? (
                <input
                    defaultValue={game.title}
                    autoFocus
                    onBlur={(e) => {
                        updateField({ title: e.target.value.trim() });
                        setIsEditingTitle(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            e.target.blur();
                        }
                    }}
                    style={{
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        background: "transparent",
                        color: "#fff",
                        border: "1px solid rgba(var(--theme-yellow), 0.5)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        marginBottom: "4px",
                    }}
                />
            ) : (
                <Title onClick={() => isDeveloper && setIsEditingTitle(true)} style={{ cursor: isDeveloper ? "pointer" : "default" }}>
                    {game.title}
                </Title>
            )}

            {isDeveloper && (
                <div style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "rgb(var(--theme-grey))",

                }}>
                    Вы разработчик этой игры
                </div>
            )}

            <Reviews>
                <Rating rating={game.rating} />
                <span>{game.reviews} отзывов </span>
            </Reviews>
            {isDeveloper && isEditingPrices ? (
                <PriceEditWrapper>
                    <PriceInput
                        type="text"
                        inputMode="decimal"
                        defaultValue={pricePerLaunch}
                        onBlur={(e) => {
                            updateField({ pricePerLaunch: parseFloat(e.target.value) }, () => setIsEditingPrices(false));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.target.blur();
                        }}
                    />
                    <PriceLabelDevmode>₽ / запуск</PriceLabelDevmode>

                    <PriceInput
                        type="text"
                        inputMode="decimal"
                        defaultValue={priceDay}
                        onBlur={(e) => {
                            updateField({ price_per_day: parseFloat(e.target.value) }, () => setIsEditingPrices(false));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.target.blur();
                        }}
                    />
                    <PriceLabelDevmode>₽ / день</PriceLabelDevmode>

                    <PriceInput
                        type="text"
                        inputMode="decimal"
                        defaultValue={pricePerMonth}
                        onBlur={(e) => {
                            updateField({ pricePerMonth: parseFloat(e.target.value) }, () => setIsEditingPrices(false));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.target.blur();
                        }}
                    />
                    <PriceLabelDevmode>₽ / месяц</PriceLabelDevmode>
                </PriceEditWrapper>
            ) : (
                <PriceWrapper onClick={() => isDeveloper && setIsEditingPrices(true)}>
                    <div style={{ color: "rgb(var(--theme-yellow))" }}>
                        {pricePerLaunch} <span style={{ color: "rgb(var(--theme-grey))", fontWeight: "normal" }}>₽ / запуск</span>
                    </div>
                    <div style={{ color: "rgb(var(--theme-yellow))" }}>
                        {priceDay} <span style={{ color: "rgb(var(--theme-grey))", fontWeight: "normal" }}>₽ / день</span>
                    </div>
                    <div style={{ color: "rgb(var(--theme-yellow))" }}>
                        {pricePerMonth} <span style={{ color: "rgb(var(--theme-grey))", fontWeight: "normal" }}>₽ / месяц</span>
                    </div>
                </PriceWrapper>
            )}

            <ButtonGroup>
                <button>Демо</button>
                <button onClick={onBuyClick}>Купить</button>

            </ButtonGroup>
            <Delimeter />
            <Description>{description}</Description>
            <Delimeter />
            <GameDetails>
                <div>
                    <span>Жанр:</span> {genre}
                </div>
                <div>
                    <span>Формат:</span> {format}
                </div>
                <div>
                    <span>Продолжительность:</span> {duration}
                </div>
                <div>
                    <span>Автор:</span> {author}
                </div>
            </GameDetails>

        </InfoWrapper>
    );
};

export default InfoContainer;
