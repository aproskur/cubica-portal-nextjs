"use client";

import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";

const ClientWrapperAuth = () => {
    const { isLoginModalOpen, closeLoginModal } = useAuth();

    console.log("ClientWrapperAuth RENDERED, isLoginModalOpen =", isLoginModalOpen); // DEBUG

    return <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />;
};

export default ClientWrapperAuth;
