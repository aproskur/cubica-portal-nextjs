"use client";

import { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {

    const { isAuthenticated, requestLoginForPurchase, pendingPurchase } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [successData, setSuccessData] = useState(null);

    const openPurchaseModal = (payload) => {
        // Case 1: Robokassa success redirect
        if (payload?.showSuccessMessage) {
            setSuccessData(payload);
            setGameData(null);
            setIsModalOpen(true);
            return;
        }

        // Case 2: Not authenticated yet, initiate login
        if (!isAuthenticated) {
            requestLoginForPurchase(payload);
            return;
        }

        // Case 3: Normal game purchase
        setGameData(payload);
        setSuccessData(null);
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
        <ModalContext.Provider value={{ isModalOpen, gameData, openPurchaseModal, closePurchaseModal, successData, setSuccessData }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
