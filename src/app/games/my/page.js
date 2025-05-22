"use client";

import { useEffect, useState } from "react";
import GameLinksTable from "@/components/GameLinksTable";
import { useSearch } from "@/context/SearchContext";
import { fetchUserPurchases } from "@/utils/apiService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 5rem;

  @media (max-width: 800px) {
    padding: 0;
  }
`;

export default function MyGamesPage() {
    const { token, user, loading } = useAuth();
    const { searchQuery } = useSearch();
    const router = useRouter();

    // Add state for both games and links
    const [games, setGames] = useState([]);
    const [links, setLinks] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const loadPurchases = async () => {
            try {
                const data = await fetchUserPurchases();

                if (!data || !Array.isArray(data)) {
                    setGames([]);
                    return;
                }

                const enrichedPurchases = data.map(p => ({
                    ...p,
                    game: p.game,
                    title: p.game?.title || "Без названия",
                    date: new Date(p.purchaseDate).toLocaleDateString("ru-RU"),
                    type: p.package_type,
                    startDate: p.start_date
                        ? new Date(p.start_date).toLocaleDateString("ru-RU")
                        : null,
                    endDate: p.end_date
                        ? new Date(p.end_date).toLocaleDateString("ru-RU")
                        : null,
                }));

                setGames(enrichedPurchases);
            } catch (error) {
                console.error("Error fetching purchases:", error);
                setGames([]);
            } finally {
                setFetching(false);
            }
        };

        if (token) {
            loadPurchases();
        }
    }, [token]);


    const filteredGames = games && Array.isArray(games)
        ? games.filter(game =>
            game?.title?.toLowerCase().includes(searchQuery.toLowerCase() || "")
        )
        : [];

    if (loading || fetching) return <p>Загружаем...</p>;
    if (!games.length) return <p>У вас пока что нет купленных игр</p>;

    return (
        <Container>
            {/*<h1>{user?.username}'s Games</h1>*/}
            {/*Pass extracted links to the GameLinksTable */}
            <GameLinksTable games={filteredGames} />
        </Container>
    );
}
