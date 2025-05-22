"use client";
import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        searchQuery: "",
        onlyMyDevelopedGames: false,
        priceRange: null,
        duration: "",
        competencies: [],
        sort: "",           // e.g. "alphabet", "date", etc.
        sortOrder: "asc",   // or "desc"
        totalPlayed: null
    });

    const updateFilters = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters({
            searchQuery: "",
            onlyMyDevelopedGames: false,
            priceRange: null,
            competencies: [],
            sort: "",
            sortOrder: "asc",
            duration: "",
            totalPlayed: null
        });
    };
    
    return (
        <FiltersContext.Provider value={{ filters, updateFilters, resetFilters }}>
            {children}
        </FiltersContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FiltersContext);
    if (!context) {
        throw new Error("useFilters must be used within a FiltersProvider");
    }
    return context;
};
