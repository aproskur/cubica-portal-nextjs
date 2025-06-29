'use client';

import { useEffect, useState } from 'react';
import GameLinksTable from '@/components/GameLinksTable';
import { useSearch } from '@/context/SearchContext';
import { fetchUserPurchases } from '@/utils/apiService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useFilters } from '@/context/FiltersContext';

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
  const { filters } = useFilters();

  // Add state for both games and links
  const [games, setGames] = useState([]);
  const [fetching, setFetching] = useState(true);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  };

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const data = await fetchUserPurchases();

        if (!data || !Array.isArray(data)) {
          setGames([]);
          return;
        }

        const enrichedPurchases = data.map((p) => ({
          ...p,
          game: p.game,
          title: p.game?.title || 'Без названия',
          date: formatDate(p.purchaseDate),
          type: p.package_type,
          startDate: p.start_date ? formatDate(p.start_date) : null,
          endDate: p.end_date ? formatDate(p.end_date) : null,
        }));

        setGames(enrichedPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setGames([]);
      } finally {
        setFetching(false);
      }
    };

    if (token) {
      loadPurchases();
    }
  }, [token]);

  const filteredGames =
    games?.filter((game) => {
      const matchesSearch = game?.title
        ?.toLowerCase()
        .includes(filters.searchQuery.toLowerCase() || '');
      const isExpired = game.end_date && new Date(game.end_date) < new Date();

      if (filters.linkStatus === 'active-links' && isExpired) return false;
      if (filters.linkStatus === 'archive-links' && !isExpired) return false;

      return matchesSearch;
    }) || [];

  if (loading || fetching) return <p>Загружаем...</p>;
  if (!games.length) return <p>У вас пока что нет купленных игр</p>;

  return (
    <Container>
      <GameLinksTable games={filteredGames} />
    </Container>
  );
}
