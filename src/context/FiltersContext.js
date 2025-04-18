"use client";
import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        searchQuery: "",
        onlyMyDevelopedGames: false,
        categories: [],    // later: array of selected category IDs
        priceRange: null,  // later: { min: 0, max: 100 }
        // more filters
    });

    const updateFilters = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters({
            searchQuery: "",
            onlyMyDevelopedGames: false,
            categories: [],
            priceRange: null,
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
