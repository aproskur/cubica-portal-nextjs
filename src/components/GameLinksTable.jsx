'use client';
import styled from 'styled-components';
import { CiShare2 } from 'react-icons/ci';
import { FiCopy } from 'react-icons/fi';
import { generateGameLink, getLatestGameLink } from '@/utils/apiService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRef, useState } from 'react';

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

const Tbody = styled.tbody`
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
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
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid rgba(var(--theme-yellow), 0.8);
    padding: 15px;
    width: 100%;
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

const CopyIcon = styled(FiCopy)`
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

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: inline-block;
  }
`;

const DesktopOnly = styled.div`
  display: inline-block;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ShareMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: rgb(var(--background));
  border: 1px solid rgb(var(--theme-grey));
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  padding: 6px;
  min-width: 220px;
  z-index: 20;
`;

const ShareMenuItem = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 10px 12px;
  cursor: pointer;
  color: rgb(var(--foreground));
  border-radius: 6px;
  &:hover {
    background: rgba(var(--theme-yellow), 0.1);
  }
`;

const GameLinksTable = ({ games: purchases }) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const isMobile = useIsMobile();
  const [menuFor, setMenuFor] = useState(null); // purchase id currently showing the menu

  if (!purchases || purchases.length === 0) {
    return <p>У вас пока что нет купленных игр</p>;
  }

  const inFlight = useRef(new Set());

  const buildWhatsAppHref = (url, title) => {
    const text = `${title} — ${url}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const buildTelegramHref = (url, title) => {
    return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  };

  const isExpired = (purchase) => {
    if (!purchase.end_date) return false;
    return new Date(purchase.end_date) < new Date();
  };

  const sortedPurchases = [...purchases].sort(
    (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
  );

  // Fetch a link once: latest if exists, otherwise create
  const getUrlForAction = async (purchase) => {
    const pid = purchase.documentId ?? purchase.id;

    // 1) Try latest
    const latest = await ensureOnce(`latest:${pid}`, () => getLatestGameLink(pid, token));
    if (latest?.url) return latest.url;

    // 2) Fallback: generate
    const created = await ensureOnce(pid, () => generateGameLink(pid, token));
    return created?.url || null;
  };

  // Copy only
  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast(`Ссылка скопирована: ${url}`, 4000, 'top-center');
    } catch {
      showToast(`Скопируйте вручную: ${url}`, 7000, 'top-center');
    }
  };

  // Share only (used on mobile). Falls back to copy if share isn’t available.
  const shareLink = async (url, title) => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        showToast(`Ссылка отправлена: ${url}`, 4000, 'top-center');
        return;
      }
    } catch (e) {
      if (e && (e.name === 'AbortError' || /AbortError/i.test(e.message))) {
        showToast('Отправка отменена', 3000, 'top-center');
        return;
      }
      // fall through to copy
    }
    await copyLink(url);
  };

  const ensureOnce = async (key, fn) => {
    if (inFlight.current.has(key)) return null;
    inFlight.current.add(key);
    try {
      return await fn();
    } finally {
      inFlight.current.delete(key);
    }
  };

  // Title click → create (or reuse) then COPY
  const handleCreateAndCopy = async (purchase) => {
    if (!token) return showToast('Вы не авторизованы. Войдите, чтобы получить ссылку.');
    const pid = purchase.documentId ?? purchase.id;
    const data = await ensureOnce(pid, () => generateGameLink(pid, token));
    if (data?.url) await copyLink(data.url);
  };

  // Mobile share button
  const handleShareMobile = async (purchase) => {
    if (!token) return showToast('Вы не авторизованы. Войдите, чтобы получить ссылку.');
    const url = await getUrlForAction(purchase);
    if (url) await shareLink(url, purchase.title);
  };

  // Desktop copy button
  const handleCopyDesktop = async (purchase) => {
    if (!token) return showToast('Вы не авторизованы. Войдите, чтобы получить ссылку.');
    const url = await getUrlForAction(purchase);
    if (url) await copyLink(url);
  };

  const handleSystemShare = async (purchase) => {
    try {
      const url = await getUrlForAction(purchase);
      if (!url) return;
      if (navigator.share) {
        await navigator.share({ title: purchase.title, url });
        showToast(`Ссылка отправлена: ${url}`, 4000, 'top-center');
      } else {
        await copyLink(url); // graceful fallback
      }
    } catch (e) {
      if (e?.name === 'AbortError') {
        showToast('Отправка отменена', 3000, 'top-center');
      } else {
        showToast('Не удалось поделиться. Скопирована ссылка.', 4000, 'top-center');
        const url = await getUrlForAction(purchase);
        if (url) await copyLink(url);
      }
    } finally {
      setMenuFor(null);
    }
  };

  const handleShareWhatsApp = async (purchase) => {
    const url = await getUrlForAction(purchase);
    if (!url) return;
    const href = buildWhatsAppHref(url, purchase.title);
    // try to open in a new tab; if blocked, replace location
    const win = window.open(href, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = href;
    setMenuFor(null);
  };

  const handleShareTelegram = async (purchase) => {
    const url = await getUrlForAction(purchase);
    if (!url) return;
    const href = buildTelegramHref(url, purchase.title);
    const win = window.open(href, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = href;
    setMenuFor(null);
  };

  const handleCopyFromMenu = async (purchase) => {
    const url = await getUrlForAction(purchase);
    if (url) await copyLink(url);
    setMenuFor(null);
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
      <Tbody>
        {sortedPurchases.map((purchase) => (
          <HoverRow
            key={purchase.id}
            tabIndex="0"
            style={{
              opacity: isExpired(purchase) ? 0.4 : 1,
              pointerEvents: isExpired(purchase) ? 'none' : 'auto',
            }}
          >
            <Td> {purchase.date}</Td>
            <GameNameTd>
              <GameNameContainer>
                <GameNameSpan onClick={() => handleCreateAndCopy(purchase)}>
                  {purchase.title}
                </GameNameSpan>
                <Tooltip>{purchase.title}</Tooltip>

                {/* Mobile: Share button opens menu */}
                <MobileOnly>
                  <GameShareButton
                    type="button"
                    onClick={() =>
                      setMenuFor((prev) =>
                        prev === (purchase.documentId ?? purchase.id)
                          ? null
                          : (purchase.documentId ?? purchase.id)
                      )
                    }
                    aria-label="Поделиться"
                    title="Поделиться"
                  >
                    <ShareIcon size={18} />
                  </GameShareButton>

                  {menuFor === (purchase.documentId ?? purchase.id) && (
                    <ShareMenu>
                      {/* System share (if supported) */}
                      <ShareMenuItem onClick={() => handleSystemShare(purchase)}>
                        Системное меню (iOS/Android)
                      </ShareMenuItem>
                      <ShareMenuItem onClick={() => handleShareWhatsApp(purchase)}>
                        Отправить в WhatsApp
                      </ShareMenuItem>
                      <ShareMenuItem onClick={() => handleShareTelegram(purchase)}>
                        Отправить в Telegram
                      </ShareMenuItem>
                      <ShareMenuItem onClick={() => handleCopyFromMenu(purchase)}>
                        Копировать ссылку
                      </ShareMenuItem>
                    </ShareMenu>
                  )}
                </MobileOnly>

                {/* Desktop: Copy button */}
                <DesktopOnly>
                  <GameShareButton
                    type="button"
                    onClick={() => handleCopyDesktop(purchase)}
                    aria-label="Копировать ссылку"
                    title="Копировать ссылку"
                  >
                    <CopyIcon size={18} />
                  </GameShareButton>
                </DesktopOnly>

                {isExpired(purchase) && (
                  <span style={{ fontSize: '0.75rem', color: 'gray', marginLeft: '8px' }}>
                    Архивная
                  </span>
                )}
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
      </Tbody>
    </Table>
  );
};

export default GameLinksTable;
