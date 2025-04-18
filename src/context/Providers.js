"use client";
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import { GamesDataProvider } from "@/context/GamesDataContext"
import { ModalProvider } from "./ModalContext";
import { FiltersProvider } from "./FiltersContext";



export default function Providers({ children }) {



    return (
        <AuthProvider>
            <GamesDataProvider>
                <FiltersProvider>
                    <SearchProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </SearchProvider>
                </FiltersProvider>
            </GamesDataProvider>
        </AuthProvider>
    );
}
