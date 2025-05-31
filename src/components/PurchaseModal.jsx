"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import LoginModal from "./LoginModal";
import { createOrder } from "@/utils/apiService";
import { updateOrderStatus, createPurchase, testRobokassaLink, getRobokassaPaymentLink } from "@/utils/apiService";
import { useGamesData } from "@/context/GamesDataContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import { registerLocale } from "react-datepicker";

registerLocale("ru", ru);


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
 
  padding: 8px;
  font-size: 1rem;
  border: 1px solid rgb(var(--theme-grey));
  border-radius: 5px;
  background: rgb(var(--background));
  color: rgb(var(--foreground));
  cursor: pointer;
  transition: border 0.3s ease;
  font-family: var(--font-montserrat), Arial, Helvetica, sans-serif;

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
    const { isAuthenticated, isLoading } = useAuth();
    const { isModalOpen, gameData, closePurchaseModal, successData, setSuccessData } = useModal();
    const [selectedPackage, setSelectedPackage] = useState("one-time");
    const [price, setPrice] = useState(gameData?.pricePerLaunch || 0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(""); // display only
    const [endDateRaw, setEndDateRaw] = useState(""); // raw ISO value for API

    const [loading, setLoading] = useState(false);
    const [purchaseDone, setPurchaseDone] = useState(false)
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const { refreshPurchasedGames } = useGamesData();

    useEffect(() => {
        if (selectedPackage === "one-time") {
            setPrice(gameData?.pricePerLaunch || 0);
            setEndDate("");
            setEndDateRaw(""); // reset raw value too
        } else if (selectedPackage === "day") {
            setPrice(gameData?.pricePerDay || 0);
            setEndDate(startDate);
            setEndDateRaw(startDate); // match start date
        } else if (selectedPackage === "month") {
            setPrice(gameData?.pricePerMonth || 0);
            if (startDate) {
                const newEndDate = new Date(startDate);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
                const iso = newEndDate.toISOString().split("T")[0];
                const formatted = newEndDate.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
                setEndDate(formatted); // or set display version
                setEndDateRaw(iso); // for backend
            } else {
                setEndDate("");
                setEndDateRaw("");
            }
        }
    }, [selectedPackage, gameData, startDate]);



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get("payment");
        const orderId = params.get("InvId");

        if (paymentStatus === "success" && orderId) {
            // trigger refetch or success message
            setPurchaseDone(true);
            // optionally clear URL
            window.history.replaceState(null, "", "/");
        }
    }, []);


    const handleCloseModal = () => {
        setPurchaseDone(false);
        closePurchaseModal();
    }

    if (!isModalOpen || isLoading) return null;
    if (!isAuthenticated) return <LoginModal onClose={handleCloseModal} />;


    const handlePurchase = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Step 1: Create Order
            const orderResponse = await createOrder(
                gameData.documentId,
                selectedPackage,
                startDate ? new Date(startDate).toISOString() : null,
                endDateRaw ? new Date(endDateRaw).toISOString() : null,
                price
            );

            if (!orderResponse.success) {
                setError(mapOrderError(orderResponse.error));
                setLoading(false);
                return;
            }

            // Step 2: Get Robokassa payment link
            const paymentLinkResponse = await getRobokassaPaymentLink(orderResponse.order.documentId);

            if (!paymentLinkResponse.success) {
                setError("Не удалось получить ссылку на оплату.");
                setLoading(false);
                return;
            }

            // Step 3: Redirect and exit
            window.location.href = paymentLinkResponse.url;
            return;

        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    // Map API errors to user-friendly messages
    const mapOrderError = (errorCode) => {
        switch (errorCode) {
            case "AUTHENTICATION_REQUIRED":
                return "You need to log in to purchase this game.";
            case "GAME_NOT_FOUND":
                return "The selected game is no longer available.";
            case "INVALID_PACKAGE_TYPE":
                return "Invalid package selection. Please choose a valid option.";
            default:
                return "An unexpected error occurred. Please try again.";
        }
    };



    // added to render modal after redirect from payment gateway
    if (successData) {
        return (
            <ModalOverlay>
                <ModalContent>
                    <CloseButton onClick={() => {
                        setSuccessData(null);
                        handleCloseModal();
                    }}>×</CloseButton>

                    <h2 style={{
                        textAlign: "center",
                        fontWeight: "normal",
                        color: "rgb(var(--theme-yellow))",
                        fontSize: "1rem",
                        textTransform: "uppercase"
                    }}>Покупка успешно завершена</h2>

                    <p>Номер заказа: <strong>{successData.orderId}</strong></p>
                    <p>Сумма: <strong style={{ color: "rgb(var(--theme-yellow))" }}>{successData.price} руб.</strong></p>
                    <div style={{ lineHeight: "25px" }}>
                        Вы можете найти игру в разделе{" "}
                        <a href="/games/my" style={{ color: "rgb(var(--theme-yellow))", textDecoration: "none" }}>
                            Мои покупки
                        </a>.
                    </div>

                    <CubicaButton onClick={() => {
                        setSuccessData(null);
                        handleCloseModal();
                    }}>Закрыть</CubicaButton>
                </ModalContent>
            </ModalOverlay>
        );
    }

    // Defensive check — don't show anything if game data is missing
    if (!gameData) return null;

    // Normal purchas modal UI
    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={handleCloseModal}>×</CloseButton>
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
                        <DatePicker
                            selected={startDate ? new Date(startDate) : null}
                            onChange={(date) => {
                                const iso = date.toISOString().split("T")[0];
                                setStartDate(iso);
                                setEndDateRaw(iso); // <== this was missing
                                setEndDate(iso);    // optional: for display
                            }}

                            dateFormat="dd.MM.yyyy"
                            locale="ru"
                            customInput={<DateInput />}
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
                            <DatePicker
                                selected={startDate ? new Date(startDate) : null}
                                onChange={(date) => {
                                    const isoStart = date.toISOString().split("T")[0];
                                    setStartDate(isoStart);

                                    const end = new Date(date);
                                    end.setMonth(end.getMonth() + 1);


                                    const isoEnd = end.toISOString().split("T")[0]; // raw
                                    const formattedEnd = end.toLocaleDateString("ru-RU", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    });

                                    setEndDate(isoEnd);
                                    setEndDate(formattedEnd);

                                }}
                                dateFormat="dd.MM.yyyy"
                                locale="ru"
                                customInput={<DateInput />}
                            />
                            {endDate && <span> - {endDate}</span>}
                        </div>
                    )}

                </RadioButtonsWrapper>



                <p>
                    Стоимость: <strong style={{ color: "rgb(var(--theme-yellow))" }}>{price} руб.</strong>
                </p>
                <div> {purchaseDone ? successMessage : `После оплаты ссылка будет доступна в "Мои покупки"`}</div>

                {purchaseDone ? (
                    <CubicaButton onClick={handleCloseModal}>Закрыть</CubicaButton>
                ) : (
                    <CubicaButton onClick={handlePurchase} disabled={loading}>
                        {loading ? "Обработка..." : "Оплатить"}
                    </CubicaButton>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

export default PurchaseModal;