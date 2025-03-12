"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import LoginModal from "./LoginModal";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgb(var(--background));
  padding: 2rem 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  color: rgb(var(--foreground));
  border: 1px solid rgba(var(--theme-yellow), 0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 
`;


const RadioButtonsWrapper = styled.div`

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;


const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
`;

const RadioInput = styled.input`
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid rgb(var(--theme-grey));
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:checked {
    border-color: rgb(var(--theme-yellow));
  }

  &:checked::before {
    content: "";
    width: 8px;
    height: 8px;
    background-color: rgb(var(--theme-yellow));
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: rgba(var(--theme-yellow), 0.7);
  }
`;

const DateInput = styled.input`
  width: 35%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid rgb(var(--theme-grey));
  border-radius: 5px;
  background: rgb(var(--background));
  color: rgb(var(--foreground));
  cursor: pointer;
  transition: border 0.3s ease;

  &:focus {
    border-color: rgb(var(--theme-yellow));
    outline: none;
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1); /* Ensures the calendar icon is visible */
  }
`;

const CubicaButton = styled.button`
    background-color: inherit;
    border: 1px solid rgb(var(--theme-grey));
    color: rgb(var(--theme-yellow));
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-transform: uppercase;
    width: 30%;
    align-self: center;
    
    &:hover {
        border: 1px solid rgb(var(--theme-yellow));
        color: rgb(var(--foreground));
    }
`;


const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
`;

const PurchaseModal = () => {
    const { isAuthenticated } = useAuth();
    const { isModalOpen, gameData, closePurchaseModal } = useModal();
    const [selectedPackage, setSelectedPackage] = useState("one-time");
    const [price, setPrice] = useState(gameData?.pricePerLaunch || 0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (selectedPackage === "one-time") {
            setPrice(gameData?.pricePerLaunch || 0);
            setEndDate("");
        } else if (selectedPackage === "day") {
            setPrice(gameData?.pricePerDay || 0);
            setEndDate(startDate); // End date same as start date for one day
        } else if (selectedPackage === "month") {
            setPrice(gameData?.pricePerMonth || 0);
            if (startDate) {
                const newEndDate = new Date(startDate);
                newEndDate.setMonth(newEndDate.getMonth() + 1);

                // Format to DD-MM-YYYY
                const formattedEndDate = newEndDate.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });

                setEndDate(formattedEndDate);
            } else {
                setEndDate("");
            }
        }
    }, [selectedPackage, gameData, startDate]);


    if (!isModalOpen) return null;
    if (!isAuthenticated) return <LoginModal onClose={closePurchaseModal} />;

    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={closePurchaseModal}>×</CloseButton>
                <h2 style={{
                    textAlign: "center",
                    fontWeight: "normal",
                    color: "rgb(var(--theme-yellow))",
                    fontSize: "1rem",
                    textTransform: "uppercase"
                }}>Покупка игры</h2>
                <p>
                    Игра: <strong>{gameData?.title}</strong>
                </p>
                <p>Выберите подходящий пакет:</p>
                <RadioButtonsWrapper>
                    {/* One-time launch (No Date Picker) */}
                    <RadioLabel>
                        <RadioInput
                            type="radio"
                            name="package"
                            value="one-time"
                            checked={selectedPackage === "one-time"}
                            onChange={() => setSelectedPackage("one-time")}
                        />
                        Разовый запуск
                    </RadioLabel>

                    {/* Game Day (Show Date Picker when selected) */}
                    <RadioLabel>
                        <RadioInput
                            type="radio"
                            name="package"
                            value="day"
                            checked={selectedPackage === "day"}
                            onChange={() => setSelectedPackage("day")}
                        />
                        Игровой день
                    </RadioLabel>
                    {selectedPackage === "day" && (
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    )}

                    {/* Game Month (Show Date Picker and auto-calculate end date) */}
                    <RadioLabel>
                        <RadioInput
                            type="radio"
                            name="package"
                            value="month"
                            checked={selectedPackage === "month"}
                            onChange={() => setSelectedPackage("month")}
                        />
                        Игровой месяц
                    </RadioLabel>
                    {selectedPackage === "month" && (
                        <div>
                            <DateInput
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    const newStartDate = e.target.value;
                                    setStartDate(newStartDate);

                                    // Automatically set end date one month ahead
                                    const newEndDate = new Date(newStartDate);
                                    newEndDate.setMonth(newEndDate.getMonth() + 1);
                                    setEndDate(newEndDate.toISOString().split("T")[0]);
                                }}
                            />
                            {endDate && <span> - {endDate}</span>}
                        </div>
                    )}
                </RadioButtonsWrapper>



                <p>
                    Стоимость: <strong style={{ color: "rgb(var(--theme-yellow))" }}>{price} руб.</strong>
                </p>
                <p>После оплаты ссылка будет доступна в "Мои покупки"</p>

                <CubicaButton>Оплатить</CubicaButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PurchaseModal;
