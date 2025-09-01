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
import MobileFooter from '@/components/MobileFooter';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';

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
      'tabs'
      'footer';

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

const FooterContainer = styled.div`
  grid-area: footer;

  @media (min-width: 876px) {
    display: none;
  }
`;

const GamePage = () => {
  const { slug } = useParams(); // Get slug from URL
  const { user, token } = useAuth(); // token might be undefined
  const { openPurchaseModal, setIsModalOpen } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState(null);
  const [fetchedSlugs, setFetchedSlugs] = useState(new Set());
  const [isNotFound, setIsNotFound] = useState(false);

  const { currentGame: game, setCurrentGame, updateGameInList } = useGamesData();
  const router = useRouter();

  useEffect(() => {
    if (isNotFound) {
      router.replace('/not-found');
    }
  }, [isNotFound]);

  // added for the force setting, updated for resetting current game
  useEffect(() => {
    let isMounted = true;

    const loadGame = async () => {
      try {
        const gameData = await fetchGameBySlug(slug, token);
        if (isMounted) {
          setCurrentGame(gameData);
        }
      } catch (err) {
        console.error('Failed to load game:', err);

        if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
          setIsNotFound(true); // mark for 404
          return;
        } else {
          setFatalError('Произошла ошибка при загрузке игры. Попробуйте позже.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadGame();
    }

    return () => {
      isMounted = false;
      setCurrentGame(null);
    };
  }, [slug, token, setCurrentGame]);

  // Fix mutiple rerendering
  useEffect(() => {
    if (!slug || !token || !game) return;

    const isEnrichmentNeeded = !game.game_plot || !game.game_purpose || !game.game_support;

    if (isEnrichmentNeeded && !fetchedSlugs.has(slug)) {
      fetchGameBySlug(slug, token).then((fullGame) => {
        const enrichedGame = { ...game, ...fullGame };
        updateGameInList(enrichedGame);
        setCurrentGame(enrichedGame); // now Aside will get this
        setFetchedSlugs((prev) => new Set(prev).add(slug));
        console.log('SETTING CURRENT GAME:', enrichedGame);
      });
    }
  }, [
    slug,
    token,
    game, // game is enough to track all properties
    fetchedSlugs,
  ]);

  //const isDeveloper = user && game?.developed_by?.id === user.id;
  //const isDeveloper = !!user && !!game.developed_by && game.developed_by.id === user.id;
  const isDeveloper = user?.id === game?.developed_by?.id;

  const handleModalsBuyClick = (game) => {
    openPurchaseModal(game);
  };

  const mergeGameUpdates = (original, updated) => {
    return {
      ...original,
      ...updated,
      competencies: updated.competencies ?? original.competencies,
    };
  };

  const handleGameUpdateFields = async (updatedFields) => {
    const updated = await saveAndUpdateGame(updatedFields, { game, token });
    if (updated) updateGameInList(mergeGameUpdates(game, updated));
  };

  if (isLoading) return <p>Загрузка игры...</p>;

  if (isNotFound) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Игра не найдена</h1>
        <p>Такой игры не существует. Проверьте ссылку или вернитесь на главную.</p>
      </div>
    );
  }

  if (fatalError) return <p>{fatalError}</p>;
  if (!game) return null;

  const imageUrlArray =
    game.images?.map((image) => ({
      id: image.id,
      url: image.url,
    })) || [];

  return (
    <>
      <Head>
        <title>{game?.title ?? 'Игра'}</title>
      </Head>
      <GridContainer>
        <FirstRow>
          <SliderContainer>
            {imageUrlArray.length > 0 && <Swiper images={imageUrlArray} />}
          </SliderContainer>
          <InfoContainerWrapper>
            {game && (
              <InfoContainer
                token={token}
                isDeveloper={isDeveloper}
                updateGameInList={updateGameInList}
                onUpdate={handleGameUpdateFields}
                onBuyClick={() => handleModalsBuyClick(game)}
                details={{
                  format: game.format,
                  duration: game.duration,
                  author: game.author,
                }}
              />
            )}
          </InfoContainerWrapper>
        </FirstRow>
        <SecondRow>
          {game && <Tabs isEditable={isDeveloper} onUpdate={handleGameUpdateFields} />}
        </SecondRow>
        <FooterContainer>
          <MobileFooter />
        </FooterContainer>
      </GridContainer>
    </>
  );
};

export default GamePage;
