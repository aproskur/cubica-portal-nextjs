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
                console.log("Purchases API Response:", data);

                if (!data || !Array.isArray(data)) {
                    console.error("API returned invalid data:", data);
                    setGames([]);
                    setLinks([]);
                    return;
                }

                //Extract games and links and store them in state
                setGames(data.flatMap(purchase => purchase.games || []));
                setLinks(data.flatMap(purchase => purchase.links || []));

                console.log("Extracted Games:", games);
                console.log("Extracted Links:", links);
            } catch (error) {
                console.error("Error fetching purchases:", error);
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

    if (loading || fetching) return <p>Loading...</p>;
    if (!games.length) return <p>You haven't purchased any games.</p>;

    return (
        <Container>
            <h1>{user?.username}'s Games</h1>
            {/*Pass extracted links to the GameLinksTable */}
            <GameLinksTable games={filteredGames} links={links} />
        </Container>
    );
}
