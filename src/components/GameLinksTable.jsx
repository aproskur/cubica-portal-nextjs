'use client';
import styled from 'styled-components';
import { CiShare2 } from 'react-icons/ci';
import { generateGameLink } from '@/utils/apiService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const Table = styled.table`
  width: 100%;
  border-collapse: separate; /* Changed from collapse */
  border-spacing: 0 10px;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
    padding: 10px;
    position: relative;
  }
`;

const Th = styled.th`
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  padding: 10px;
  border-bottom: 1px solid rgba(var(--theme-yellow), 0.8);
  text-align: left;
  font-weight: 400;

  &:nth-child(4) {
    text-align: right;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Td = styled.td`
  padding: 10px;
  vertical-align: middle;

  /* Right-align only "Все даты" column */
  &:nth-child(4) {
    text-align: right;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 10px;
    position: relative;
  }
`;

const GameNameTd = styled(Td)`
  color: rgb(var(--theme-yellow));
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const HoverRow = styled.tr`
  transition: all 0.3s ease-in-out;
  border: 1px solid rgba(var(--background), 1);
  border-radius: 5px;

  &:hover,
  &:focus-within {
    box-shadow: 0 0 0 1px rgba(var(--theme-yellow), 1);
    border-radius: 5px;
    outline: none;
    & > td > button > svg {
      color: rgb(var(--theme-yellow));
    }
  }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 10px;
    border: 1px solid rgba(var(--theme-yellow), 0.8);
    padding: 15px;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: rgb(var(--foreground));
  &:hover {
    color: rgb(var(--theme-yellow));
  }
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
`;

const ShareIcon = styled(CiShare2)`
  color: rgb(var(--theme-yellow));
`;

const GameNameContainer = styled.div`
  display: flex;
  align-items: center; /* Keep game name and button inline */
  gap: 8px;
  position: relative; /* Needed for absolute tooltip positioning */
`;

const GameNameSpan = styled.span`
  max-width: 225px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  cursor: pointer;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0; /* Align tooltip with the game name */
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  z-index: 1000;
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  ${GameNameContainer}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(-5px);
  }
`;

const GameShareButton = styled.button`
  background: none;
  border: 1px solid rgb(var(--theme-grey));
  cursor: pointer;
  padding: 5px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  transition: background 0.2s ease-in-out;

  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

const GameLinksTable = ({ games: purchases }) => {
  const { token } = useAuth();
  const { showToast } = useToast();

  console.log('PURCHASES lnk table', purchases);

  if (!purchases || purchases.length === 0) {
    return <p>У вас пока что нет купленных игр</p>;
  }

  const sortedPurchases = [...purchases].sort(
    (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
  );

  const handleShare = async (purchase) => {
    if (!token) {
      showToast('Вы не авторизованы. Войдите, чтобы получить ссылку.');
      return;
    }

    try {
      const result = await generateGameLink(purchase.documentId, token);
      const url = result.url;

      await navigator.clipboard.writeText(url);
      showToast(`Ссылка скопирована: ${url}`, 5000, 'top-center');
    } catch (err) {
      showToast(`Ошибка: ${err.message}`, 5000, 'top-center');
    }
  };

  const translateType = (type) => {
    switch (type) {
      case 'one-time':
        return 'Разовый запуск';
      case 'day':
        return 'День';
      case 'month':
        return 'Месяц';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <Th>Дата покупки</Th>
          <Th>Название</Th>
          <Th>Тип пакета</Th>
          <Th>Период действия</Th>
        </tr>
      </thead>
      <tbody>
        {sortedPurchases.map((purchase) => (
          <HoverRow key={purchase.id} tabIndex="0">
            <Td>{purchase.date}</Td>
            <GameNameTd>
              <GameNameContainer>
                <GameNameSpan>{purchase.title}</GameNameSpan>
                <Tooltip>{purchase.title}</Tooltip>
                <GameShareButton onClick={() => handleShare(purchase)}>
                  <ShareIcon size={18} />
                </GameShareButton>
              </GameNameContainer>
            </GameNameTd>
            <Td>{translateType(purchase.type)}</Td>
            <Td>
              <DateContainer>
                {purchase.startDate && purchase.endDate ? (
                  <span>
                    {purchase.startDate} - {purchase.endDate}
                  </span>
                ) : (
                  <span>{purchase.date}</span>
                )}
              </DateContainer>
            </Td>
          </HoverRow>
        ))}
      </tbody>
    </Table>
  );
};

export default GameLinksTable;
