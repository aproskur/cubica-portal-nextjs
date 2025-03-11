"use client";

import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameData, setGameData] = useState(null);

    const openPurchaseModal = (game) => {
        setGameData(game);
        setIsModalOpen(true);
    };

    const closePurchaseModal = () => {
        setIsModalOpen(false);
        setGameData(null);
    };

    return (
        <ModalContext.Provider value={{ isModalOpen, gameData, openPurchaseModal, closePurchaseModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
