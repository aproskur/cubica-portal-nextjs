"use client";
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "./ModalContext";

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <SearchProvider>
                <ModalProvider>
                    {children}
                </ModalProvider>
            </SearchProvider>
        </AuthProvider>
    );
}
