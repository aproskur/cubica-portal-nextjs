"use client";
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import { GamesDataProvider } from "@/context/GamesDataContext"
import { ModalProvider } from "./ModalContext";



export default function Providers({ children }) {



    return (
        <AuthProvider>
            <GamesDataProvider>
                <SearchProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </SearchProvider>
            </GamesDataProvider>
        </AuthProvider>
    );
}
