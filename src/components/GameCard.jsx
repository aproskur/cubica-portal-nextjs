'use client';

import Link from 'next/link';
import styled from 'styled-components';
import SquareIconButton from './ui/SquareIconButton';
import { CiHeart } from 'react-icons/ci';
import { LuShoppingCart, LuGamepad2, LuLayoutDashboard } from 'react-icons/lu';
import {
  FaStar,
  FaInfoCircle,
  FaEdit,
  FaCopy,
  FaCheck,
  FaArchive,
  FaTimes,
  FaEyeSlash,
  FaEye,
} from 'react-icons/fa';
import { useState, useEffect, useDeferredValue } from 'react';
import { toggleFavorite, fetchFavorites } from '../utils/toggleFavourites';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { handleGameUpdate } from '@/utils/apiService';
import { useGamesData } from '@/context/GamesDataContext';
import { saveAndUpdateGame } from '@/utils/gameHelpers';

const CardWrapper = styled.div`
  position: relative;
  background-color: inherit;
  border-radius: 5px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: ${({ $showDashedBorder }) =>
    $showDashedBorder ? '2px dashed grey' : '2px solid rgb(var(--background))'};

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }

  &:hover .hover-overlay {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const TopLeftBadge = styled.div`
  position: absolute;
  top: 30px;
  left: 16px;
  background-color: rgba(var(--theme-grey), 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  gap: 4px;
  z-index: 2;
  min-width: 60px;

  @media (max-width: 500px) {
    top: 15px;
    left: 7px;
  }
`;

const TopRightBadge = styled.div`
  position: absolute;
  top: 30px;
  right: 16px;
  background-color: rgba(var(--theme-grey), 0.6);
  color: #fff;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  z-index: 2;
  min-width: 60px;

  @media (max-width: 500px) {
    top: 15px;
    right: 7px;
  }
`;

const DeveloperRibbon = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  background-color: rgba(var(--theme-yellow), 0.8);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 0px 4px 0px 4px;
  z-index: 1;
  pointer-events: none;
`;

const CardImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 12px;
  cursor: pointer;
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 5px;
  transform: scale(${({ $isOverlayVisible }) => ($isOverlayVisible ? '1' : '0')});
  opacity: ${({ $isOverlayVisible }) => ($isOverlayVisible ? '1' : '0')};
  visibility: ${({ $isOverlayVisible }) => ($isOverlayVisible ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease,
    transform 0.3s ease-out;
  z-index: 10;

  ${CardImageWrapper}:hover & {
    @media (min-width: 769px) {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
`;

const FixedIconWrapper = styled.div`
  flex-shrink: 0;
`;

const IconButton = styled.div`
  background: rgba(255, 255, 255, 0.8);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.3s;
  color: #4a4a4a;
  font-size: 20px;

  &:hover {
    background: rgba(var(--theme-grey), 0.7);
    color: rgb(var(--foreground));
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background: black;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    bottom: -35px; /* Move tooltips below for smaller buttons */
    z-index: 999;
  }
`;

const LargeIconButton = styled(IconButton)`
  width: 50px;
  height: 50px;

  &:hover::after {
    top: -30px; /* Move tooltips above for larger buttons */
    bottom: auto;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
  }
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PriceContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const PriceText = styled.span`
  font-size: 0.9rem;
`;

const PriceValue = styled.span`
  color: rgb(var(--theme-yellow));
  font-weight: bold;
`;

const PriceLabel = styled.span`
  color: rgb(var(--theme-grey));
`;

const PriceLabelDevmode = styled.div`
  align-self: center;
  font-size: 0.9rem;
  color: rgb(var(--theme-grey));
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const PriceInput = styled.input`
  width: 50px;
  padding: 8px;
  font-size: 14px;
  font-family: inherit;
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  border: 1px solid rgba(var(--theme-grey), 0.5);
  border-radius: 4px;
  text-align: right;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }

  &:focus {
    border-color: rgb(var(--theme-yellow));
    box-shadow: 0 0 5px rgba(var(--theme-yellow), 0.5);
  }
`;

const GameName = styled.h3`
  font-size: 1rem;
  color: #fff;
  margin: 0;
  cursor: pointer;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RowIcon = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgb(var(--background));
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  color: rgb(var(--foreground));
  position: relative;
  border: 1px solid rgba(var(--theme-yellow), 0.2);

  h2 {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 15px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const ModalImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 5px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`;

const ModalDetails = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 1rem;
`;

const ModalButton = styled.button`
  background: inherit;
  border: 1px solid rgb(var(--theme-grey));
  color: rgb(var(--foreground));
  font-family: var(--font-montserrat), Arial, Helvetica, sans-serif;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  width: auto;
  min-width: 150px;
  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
    color: #fff;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ModalDescription = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: rgb(var(--foreground));

  @media (max-width: 768px) {
    text-align: left;
    line-height: 1.5;
  }
`;

const GameCard = ({ game }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { isAuthenticated, user, token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceErrors, setPriceErrors] = useState({ launch: '', month: '' });

  const isPublished = game.is_published;
  const isDeveloper = !!user && !!game.developed_by && game.developed_by.id === user.id;

  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { updateGameInList } = useGamesData();

  const formatPrice = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? '—' : `${number}`;
  };

  const handleTogglePublished = async () => {
    const newStatus = !game.is_published;

    await saveAndUpdateGame(
      { is_published: newStatus },
      {
        game,
        token,
        updateGameInList,
      }
    );

    // No manual setIsPublished — the context will update game, which triggers useEffect
  };

  const handleSaveLaunchPrice = async (value) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      setPriceErrors((prev) => ({ ...prev, launch: 'Введите корректную цену за запуск.' }));
      return;
    }

    if (parsed === game.pricePerLaunch) return; // Skip if value is the same

    setPriceErrors((prev) => ({ ...prev, launch: '' }));

    await saveAndUpdateGame(
      { pricePerLaunch: parsed },
      {
        game,
        token,
        updateGameInList,
        onSuccess: () => setIsEditingPrice(false),
      }
    );
  };

  const handleSaveMonthPrice = async (value) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      setPriceErrors((prev) => ({ ...prev, month: 'Введите корректную цену за месяц.' }));
      return;
    }
    if (parsed === game.pricePerMonth) return; // Skip if unchanged

    setPriceErrors((prev) => ({ ...prev, month: '' }));

    await saveAndUpdateGame(
      { pricePerMonth: parsed },
      {
        game,
        token,
        updateGameInList,
        onSuccess: () => setIsEditingPrice(false),
      }
    );
  };

  const { openPurchaseModal } = useModal();

  const handleModalsBuyClick = (game) => {
    openPurchaseModal(game);
    setIsModalOpen(false);
  };

  // Handle favorite status on mount
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsFavorite(false); // Reset favorite when user logs out
      return;
    }

    let isMounted = true; // Flag to prevent state updates after unmounting

    fetchFavorites(user.documentId, token).then((favoriteGameIds) => {
      if (isMounted) {
        const isFav = favoriteGameIds.includes(game.documentId); // Check if the current game is in the list of favorite games
        setIsFavorite(isFav); // Update the state
      }
    });

    return () => {
      isMounted = false;
    }; // Cleanup function to prevent memory leaks
  }, [isAuthenticated, user, game.documentId, token]);

  // Optimistic update for faster UX
  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add games to favorites.');
      console.warn('User not authenticated!');
      return;
    }

    setLoading(true);
    setIsFavorite((prev) => !prev);

    try {
      const result = await toggleFavorite(game.documentId, user.documentId, token, isFavorite);

      if (!result) {
        setIsFavorite((prev) => !prev); // Revert if request fails
        console.warn('Toggle favorite request failed, reverting state.');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite((prev) => !prev);
    }

    setLoading(false);
  };

  // Handle overlay toggle
  const handleOverlayToggle = () => {
    if (window.innerWidth <= 768) {
      setIsOverlayVisible((prev) => !prev);
    }
  };

  // Close overlay when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOverlayVisible && !e.target.closest('.hover-overlay')) {
        setIsOverlayVisible(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOverlayVisible]);

  return (
    <>
      <CardWrapper $showDashedBorder={!isPublished && isDeveloper}>
        {/* Top left badge (rating) */}
        <TopLeftBadge>
          <FaStar color="white" /> {game.rating}
        </TopLeftBadge>

        {/* Top right badge (total reviews) */}
        <TopRightBadge>{game.totalPlayed}</TopRightBadge>

        {/* Game Image & Hover Overlay */}

        <CardImageWrapper onClick={handleOverlayToggle}>
          {isDeveloper && <DeveloperRibbon>Вы разработчик</DeveloperRibbon>}

          <CardImage src={game.image} alt={game.title} />
          <HoverOverlay className="hover-overlay" $isOverlayVisible={isOverlayVisible}>
            <ButtonRow>
              <LargeIconButton data-tooltip="Информация" onClick={() => setIsModalOpen(true)}>
                <FaInfoCircle />
              </LargeIconButton>
              <LargeIconButton data-tooltip="Демо">
                <LuGamepad2 />
              </LargeIconButton>
              <Link href={`/games/${game.slug}`} passHref>
                <LargeIconButton data-tooltip="Страница Игры">
                  <LuLayoutDashboard />
                </LargeIconButton>
              </Link>
            </ButtonRow>
            {isDeveloper && (
              <ButtonRow>
                <IconButton data-tooltip="Редактировать">
                  <FaEdit />
                </IconButton>
                <IconButton data-tooltip="Копировать">
                  <FaCopy />
                </IconButton>
                <IconButton
                  data-tooltip={isPublished ? 'Скрыть игру' : 'Опубликовать игру'}
                  onClick={handleTogglePublished}
                >
                  {isPublished ? <FaEyeSlash /> : <FaEye />}
                </IconButton>
                <IconButton data-tooltip="В архив">
                  <FaArchive />
                </IconButton>
              </ButtonRow>
            )}
          </HoverOverlay>
        </CardImageWrapper>

        {/* Shopping Cart & Price */}
        <CardContent>
          <FixedIconWrapper>
            <SquareIconButton icon={<LuShoppingCart />} onClick={() => openPurchaseModal(game)} />
          </FixedIconWrapper>
          {isDeveloper ? (
            <PriceContainer onClick={() => setIsEditingPrice(true)} style={{ cursor: 'pointer' }}>
              {isEditingPrice ? (
                <>
                  <PriceInput
                    type="text"
                    inputMode="decimal"
                    defaultValue={game.pricePerLaunch}
                    onBlur={(e) => handleSaveLaunchPrice(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.blur();
                      }
                    }}
                  />
                  <PriceLabelDevmode> запуск </PriceLabelDevmode>

                  <PriceInput
                    type="text"
                    inputMode="decimal"
                    defaultValue={game.pricePerMonth}
                    onBlur={(e) => handleSaveMonthPrice(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.blur();
                      }
                    }}
                  />
                  <PriceLabelDevmode> месяц </PriceLabelDevmode>
                </>
              ) : (
                <>
                  <PriceText>
                    <PriceValue>{formatPrice(game.pricePerLaunch)}</PriceValue>
                    <PriceLabel> ₽/запуск</PriceLabel>
                  </PriceText>
                  <PriceText>
                    <PriceValue>{formatPrice(game.pricePerMonth)}</PriceValue>
                    <PriceLabel> ₽/месяц</PriceLabel>
                  </PriceText>
                </>
              )}
            </PriceContainer>
          ) : (
            <PriceContainer>
              <PriceText>
                <PriceValue>{formatPrice(game.pricePerLaunch)}</PriceValue>
                <PriceLabel> ₽/запуск</PriceLabel>
              </PriceText>
              <PriceText>
                <PriceValue>{formatPrice(game.pricePerMonth)}</PriceValue>
                <PriceLabel> ₽/месяц</PriceLabel>
              </PriceText>
            </PriceContainer>
          )}
        </CardContent>

        {/* Game Title & Favorite Button */}
        <Row>
          <RowIcon>
            <SquareIconButton
              icon={<CiHeart />}
              iconType="stroke"
              color={isFavorite ? 'rgb(var(--theme-yellow))' : 'rgb(var(--theme-grey))'}
              onClick={handleFavoriteClick}
              isFavorite={isFavorite}
            />
          </RowIcon>
          <Link href={`/games/${game.slug}`}>
            <GameName>{game.title}</GameName>
          </Link>
        </Row>
        <Row>
          {' '}
          {priceErrors.launch && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              {priceErrors.launch}
            </div>
          )}
          {priceErrors.month && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              {priceErrors.month}
            </div>
          )}
        </Row>
      </CardWrapper>

      {/* Game Details Modal */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </CloseButton>
            <ModalHeader>
              <ModalImage src={game.image} alt={game.title} />
              <ModalDetails>
                <h2>{game.title}</h2>
                <PriceContainer>
                  <PriceText>
                    <PriceValue>{formatPrice(game.pricePerLaunch)}</PriceValue>
                    <PriceLabel> ₽/запуск</PriceLabel>
                  </PriceText>
                  <PriceText>
                    <PriceValue>{formatPrice(game.pricePerMonth)}</PriceValue>
                    <PriceLabel> ₽/месяц</PriceLabel>
                  </PriceText>
                </PriceContainer>
                <ButtonGroup>
                  <SquareIconButton
                    icon={<LuShoppingCart />}
                    onClick={() => handleModalsBuyClick(game)}
                  />
                  <SquareIconButton
                    icon={<CiHeart />}
                    iconType="stroke"
                    color={isFavorite ? 'rgb(var(--theme-yellow))' : 'rgb(var(--theme-grey))'}
                    onClick={handleFavoriteClick}
                  />
                  <Link href={`/games/${game.slug}`}>
                    <ModalButton>Подробнее</ModalButton>
                  </Link>
                </ButtonGroup>
              </ModalDetails>
            </ModalHeader>
            <ModalDescription>{game.description}</ModalDescription>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default GameCard;
