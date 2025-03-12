"use client";

import { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {

    const { isAuthenticated, requestLoginForPurchase, pendingPurchase } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameData, setGameData] = useState(null);

    const openPurchaseModal = (game) => {
        if (!isAuthenticated) {
            requestLoginForPurchase(game);
            // openLoginModal();
            return;
        }
        setGameData(game);
        setIsModalOpen(true);
    };

    const closePurchaseModal = () => {
        setIsModalOpen(false);
        setGameData(null);
    };

    // Automatically open the purchase modal after login
    useEffect(() => {
        if (isAuthenticated && pendingPurchase) {
            setGameData(pendingPurchase);
            setIsModalOpen(true);
        }
    }, [isAuthenticated, pendingPurchase]);


    return (
        <ModalContext.Provider value={{ isModalOpen, gameData, openPurchaseModal, closePurchaseModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
