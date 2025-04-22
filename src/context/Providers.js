"use client";
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import { GamesDataProvider } from "@/context/GamesDataContext"
import { ModalProvider } from "./ModalContext";
import { FiltersProvider } from "./FiltersContext";



export default function Providers({ children }) {



    return (
        <AuthProvider>
            <FiltersProvider>
                <GamesDataProvider>
                    <SearchProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </SearchProvider>
                </GamesDataProvider>
            </FiltersProvider>
        </AuthProvider>
    );
}
