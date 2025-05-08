"use client"
import styled from "styled-components";
import { useState } from "react";
import { saveAndUpdateGame } from "@/utils/gameHelpers";
import { FaEdit, FaCopy, FaArchive, FaEyeSlash, FaEye, FaStar } from "react-icons/fa";
import { LuShoppingCart, LuMonitorPlay } from "react-icons/lu";
import { handleGameUpdate } from "@/utils/apiService";
import CompetencyModal from "./CompetencyModal";


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

const IconButton = styled.div`
  background: inherit;
  border: 1px solid rgb(var(--theme-grey));
  width: 40px;
  height: 40px;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.3s;
  color: rgb(var(--theme-grey));
 font-size: 20px;

  &:hover {
    background: rgba(var(--theme-grey), 0.7);
     color: rgb(var(--foreground));
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background: black;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
     bottom: 45px; 
    z-index: 999;

  }

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
        totalPlayed,
        description,
        pricePerLaunch,
        pricePerMonth,
        pricePerDay,
        genre,
        format,
        duration,
        author,
        details,
        competencies,
        is_published: gameIsPublished
    } = game;

    if (!game || !game.competencies) return null;

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingPrices, setIsEditingPrices] = useState(false);
    const [descriptionText,  setDescriptionText]  = useState(game.description  || "");
    const [genreText, setGenreText] = useState(genre);
    const [formatText, setFormatText] = useState(format);
    const [durationText, setDurationText] = useState(duration);
    const [authorText, setAuthorText] = useState(author);
    const [isCompetencyModalOpen, setCompetencyModalOpen] = useState(false);
    const [localCompetencies, setLocalCompetencies] = useState(competencies);

    console.log("InfoContainer - localCompetencies:", localCompetencies);




    const isPublished = gameIsPublished;
    console.log("GAME PAGE, isPublished", isPublished);



    const updateField = async (fields, onSuccess) => {
        await saveAndUpdateGame(fields, {
            game,
            token,
            updateGameInList,
            setLocalGame: onUpdate, // passed setGame via onUpdate
            onSuccess
        });
    };

    const handleTogglePublished = async () => {
        const newStatus = !game.is_published;

        await saveAndUpdateGame(
            { is_published: newStatus },
            {
                game,
                token,
                updateGameInList,
            }
        );

        // No manual setIsPublished — the context will update `game`, which triggers useEffect
    };



    return (
        <InfoWrapper>
            {isDeveloper && isEditingTitle ? (
                <input
                    defaultValue={title}
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
                    {title}
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
                <Rating rating={rating} />
                <span>{totalPlayed} запусков </span>
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
                        defaultValue={pricePerDay}
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
                        {pricePerDay} <span style={{ color: "rgb(var(--theme-grey))", fontWeight: "normal" }}>₽ / день</span>
                    </div>
                    <div style={{ color: "rgb(var(--theme-yellow))" }}>
                        {pricePerMonth} <span style={{ color: "rgb(var(--theme-grey))", fontWeight: "normal" }}>₽ / месяц</span>
                    </div>
                </PriceWrapper>
            )}

            <ButtonGroup>
                {/* Always shown */}
                <IconButton data-tooltip="Демо">
                    <LuMonitorPlay />
                </IconButton>
                <IconButton data-tooltip="Купить" onClick={onBuyClick}>
                    <LuShoppingCart />
                </IconButton>

                {/* Only for developers */}
                {isDeveloper && (
                    <>
                        <IconButton data-tooltip="Редактировать">
                            <FaEdit />
                        </IconButton>

                        <IconButton
                            data-tooltip={isPublished ? "Скрыть игру" : "Опубликовать игру"}
                            onClick={handleTogglePublished}
                            style={{
                                border: `1px solid rgb(var(--theme-${isPublished ? "yellow" : "grey"}))`
                            }}
                        >
                            {isPublished ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>

                        <IconButton data-tooltip="В архив">
                            <FaArchive />
                        </IconButton>
                    </>
                )}
            </ButtonGroup>

            <Delimeter />
            {isDeveloper ? (
                <textarea
                    defaultValue={descriptionText}
                    onChange={e => setDescriptionText(e.target.value)}
                 onBlur={async () => {
                                   try {
                                   const token = localStorage.getItem("jwt");
                                    if (!token) throw new Error("Пользователь не авторизован");
                              
                                   await handleGameUpdate(
                                       game.documentId,
                                      { description: descriptionText },
                                       token
                                    );
                              
            
                                    alert("game description updated");
                                  } catch (err) {
                                   console.error(err);
                                    alert("Не удалось сохранить game description");
                                   }
                                 }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.target.blur();
                        }
                    }}
                    style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "10px",
                        fontSize: "14px",
                        backgroundColor: "#1c1c1c",
                        color: "#fff",
                        border: "1px solid #444",
                        borderRadius: "5px",
                        resize: "vertical",
                    }}
                />
            ) : (
                <Description>{description}</Description>
            )}

            <Delimeter />
     {/* Editable Game Details */}
     <GameDetails>
        {isDeveloper ? (
          <>
        {isDeveloper && (
  <>
  {console.log("competencies after reload", competencies)}
    <span>Тренируемые компетенции: </span>
    <span
  onClick={() => setCompetencyModalOpen(true)}
  style={{ cursor: "pointer", textDecoration: "underline", fontWeight: "normal" }}
>
{localCompetencies.map((comp) => comp.name.charAt(0).toUpperCase() + comp.name.slice(1)).join(", ")}


</span>


    {isCompetencyModalOpen && (
 <CompetencyModal
 gameId={game.documentId}
 currentCompetencies={localCompetencies.map((c) => c.documentId || c.id)}

 onClose={() => setCompetencyModalOpen(false)}
 onSave={(newCompetencies) => {
    updateField({ competencies: newCompetencies.map(c => c.id) }); // backend update
    setLocalCompetencies(newCompetencies); // frontend update
  }}
  
 updateField={updateField}
/>



)}

  </>
)}

            <div>
              <span>Жанр:</span>
              <textarea
                value={genreText}
                onChange={e => setGenreText(e.target.value)}
                onBlur={() => updateField({ genre: genreText })}
                style={{
                    width: "100%",
                    minHeight: "40px",
                    padding: "10px",
                    fontSize: "14px",
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "5px",
                    resize: "vertical",
                    marginTop: "15px"
                }}
              />
            </div>
            <div>
              <span>Формат:</span>
              <textarea
                value={formatText}
                onChange={e => setFormatText(e.target.value)}
                onBlur={() => updateField({ format: formatText })}
                style={{
                    width: "100%",
                    minHeight: "40px",
                    padding: "10px",
                    fontSize: "14px",
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "5px",
                    resize: "vertical",
                    marginTop: "15px"
                }}
              />
            </div>
            <div>
              <span>Продолжительность:</span>
              <textarea
                value={durationText}
                onChange={e => setDurationText(e.target.value)}
                onBlur={() => updateField({ duration: durationText })}
                style={{
                    width: "100%",
                    minHeight: "40px",
                    padding: "10px",
                    fontSize: "14px",
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "5px",
                    resize: "vertical",
                    marginTop: "15px"
                }}
              />
            </div>
            <div>
              <span>Автор:</span>
              <textarea
                value={authorText}
                onChange={e => setAuthorText(e.target.value)}
                onBlur={() => updateField({ author: authorText })}
                style={{
                    width: "100%",
                    minHeight: "40px",
                    padding: "10px",
                    fontSize: "14px",
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "5px",
                    resize: "vertical",
                    marginTop: "15px"
                }}
              />
            </div>
          </>
        ) : (
          <>
          <div>
          <span>Тренируемые компетенции: </span>
            <span style={{fontWeight: "normal"}}> {competencies.map((comp) => comp.name.charAt(0).toUpperCase() + comp.name.slice(1)).join(", ")}

            </span>
            </div>
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
          </>
        )}
      </GameDetails>

        </InfoWrapper>
    );
};

export default InfoContainer;
