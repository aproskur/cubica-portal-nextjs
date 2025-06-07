'use client';
import Head from 'next/head';
import Swiper from '@/components/Swiper';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Tabs from '@/components/Tabs';
import InfoContainer from '@/components/InfoContainer';
import { useParams } from 'next/navigation';
import { fetchGameBySlug } from '@/utils/apiService';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { saveAndUpdateGame } from '@/utils/gameHelpers';
import { useGamesData } from '@/context/GamesDataContext';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  grid-template-rows: auto auto; /* First row (slider + info), second row (tabs) */
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  grid-template-areas:
    'slider info'
    'tabs tabs';

  /* Mobile layout */
  @media (max-width: 875px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'info'
      'slider'
      'tabs';
    gap: 15px;
    padding: 0;
  }
`;

const FirstRow = styled.div`
  width: 100%;
  display: contents;
`;

const SliderContainer = styled.div`
  grid-area: slider;
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  gap: 10px;
  background-color: inherit;
  color: #fff;
  padding: 20px;
  overflow: hidden;
`;

const InfoContainerWrapper = styled.div`
  grid-area: info;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const SecondRow = styled.div`
  grid-area: tabs;
  padding-top: 1em;
  border-radius: 10px;
`;

const GamePage = () => {
  const { slug } = useParams(); // Get slug from URL
  const { user, token } = useAuth(); // token might be undefined
  const { openPurchaseModal, setIsModalOpen } = useModal();
  const { updateGameInList, games } = useGamesData();
  const [fetchedSlugs, setFetchedSlugs] = useState(new Set());

  const game = games.find((g) => g.slug === slug);

  // Fix mutiple rerendering
  useEffect(() => {
    if (!slug || !token || !game) return;

    const isEnrichmentNeeded = !game.game_plot || !game.game_purpose || !game.game_support;

    if (isEnrichmentNeeded && !fetchedSlugs.has(slug)) {
      fetchGameBySlug(slug, token).then((fullGame) => {
        updateGameInList({ ...game, ...fullGame }); // merge to preserve unsynced fields
        setFetchedSlugs((prev) => new Set(prev).add(slug));
      });
    }
  }, [
    slug,
    token,
    game, // game is enough to track all properties
    fetchedSlugs,
  ]);

  //const isDeveloper = user && game?.developed_by?.id === user.id;
  const isDeveloper = !!user && !!game.developed_by && game.developed_by.id === user.id;

  const [error, setError] = useState(null);

  const handleModalsBuyClick = (game) => {
    openPurchaseModal(game);
  };

  if (error) return <p>{error}</p>;

  if (!games || games.length === 0) return <p>Загрузка игр...</p>;
  if (!game) {
    return <p>Загрузка игры...</p>;
  }

  const imageUrlArray =
    game.images?.map((image) => ({
      id: image.id,
      url: image.url,
    })) || [];

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const mergeGameUpdates = (original, updated) => ({
    ...original,
    ...updated,
    competencies: updated.competencies || original.competencies,
  });

  return (
    <>
      <Head>
        <title>{game.title}</title>
      </Head>
      <GridContainer>
        <FirstRow>
          <SliderContainer>
            {imageUrlArray.length > 0 && <Swiper images={imageUrlArray} />}
          </SliderContainer>
          <InfoContainerWrapper>
            <InfoContainer
              game={game}
              token={token}
              isDeveloper={isDeveloper}
              updateGameInList={updateGameInList}
              onUpdate={async (updatedFields) => {
                const updated = await saveAndUpdateGame(updatedFields, { game, token });
                if (updated) updateGameInList(mergeGameUpdates(game, updated));
              }}
              onBuyClick={() => handleModalsBuyClick(game)}
              details={{
                format: game.format,
                duration: game.duration,
                author: game.author,
              }}
            />
          </InfoContainerWrapper>
        </FirstRow>
        <SecondRow>
          <Tabs
            game={game}
            isEditable={isDeveloper}
            onUpdate={async (updatedFields) => {
              const updated = await saveAndUpdateGame(updatedFields, { game, token });
              if (updated) updateGameInList(mergeGameUpdates(game, updated));
            }}
          />
        </SecondRow>
      </GridContainer>
    </>
  );
};

export default GamePage;
