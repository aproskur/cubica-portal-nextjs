'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTelegramPlane, FaWhatsapp, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useGamesData } from '@/context/GamesDataContext';
import { useAuth } from '@/context/AuthContext';
import { saveAndUpdateGame } from '@/utils/gameHelpers';
import { useToast } from '@/context/ToastContext';

// Styled components
const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 16px;
  color: rgb(var(--foreground));
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--foreground));
  text-decoration: none;

  &:hover {
    color: rgb(var(--theme-yellow));
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 14px;
  background: transparent;
  border: 1px solid rgb(var(--theme-grey));
  color: rgb(var(--foreground));
  border-radius: 4px;

  &:focus {
    border-color: rgb(var(--theme-yellow));
    outline: none;
  }
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: rgb(var(--theme-yellow));
  color: black;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  margin-top: 1rem;
  align-self: flex-start;
  cursor: pointer;
`;

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 876);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const DeveloperContacts = () => {
  const { currentGame: game, setCurrentGame, updateGameInList } = useGamesData();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { showToast } = useToast();

  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  const isDeveloper = game?.developed_by?.id === user?.id;

  const [telegram, setTelegram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (game && isDeveloper) {
      setTelegram(game.contactsTelegram || '');
      setWhatsapp(game.contactsWhatsapp || '');
      setEmail(game.contactsEmail || '');
      setPhone(game.contactsPhone || '');
    }
  }, [game, isDeveloper]);

  const saveContactInfo = async (fields) => {
    if (!token || !game) return;
    try {
      await saveAndUpdateGame(fields, {
        game,
        token,
        updateGameInList,
        setLocalGame: setCurrentGame,
      });
      showToast('Контактная информация сохранена', 5000, 'top-center');
    } catch (err) {
      console.error('Failed to save contact info:', err);
      showToast('Ошибка при сохранении', 5000, 'top-left');
    }
  };

  const handleBlur = (field, newValue, originalValue) => {
    if (!isMobile && isDeveloper && newValue !== originalValue) {
      saveContactInfo({ [field]: newValue });
    }
  };

  if (!game) return null;

  const hasAny =
    game.contactsTelegram || game.contactsWhatsapp || game.contactsEmail || game.contactsPhone;

  if (isDeveloper) {
    return (
      <ContactInfo>
        <label>Telegram</label>
        <Input
          value={telegram}
          onChange={(e) => {
            setTelegram(e.target.value);
            if (isMobile) setDirty(true);
          }}
          onBlur={() => handleBlur('contactsTelegram', telegram, game.contactsTelegram)}
        />

        <label>WhatsApp</label>
        <Input
          value={whatsapp}
          onChange={(e) => {
            setWhatsapp(e.target.value);
            if (isMobile) setDirty(true);
          }}
          onBlur={() => handleBlur('contactsWhatsapp', whatsapp, game.contactsWhatsapp)}
        />

        <label>Email</label>
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (isMobile) setDirty(true);
          }}
          onBlur={() => handleBlur('contactsEmail', email, game.contactsEmail)}
        />

        <label>Телефон</label>
        <Input
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (isMobile) setDirty(true);
          }}
          onBlur={() => handleBlur('contactsPhone', phone, game.contactsPhone)}
        />

        {isMobile && dirty && (
          <SaveButton
            onClick={() => {
              saveContactInfo({
                contactsTelegram: telegram,
                contactsWhatsapp: whatsapp,
                contactsEmail: email,
                contactsPhone: phone,
              });
              setDirty(false);
            }}
          >
            Сохранить
          </SaveButton>
        )}
      </ContactInfo>
    );
  }

  if (!hasAny) {
    return <ContactInfo>Нет доступной контактной информации</ContactInfo>;
  }

  return (
    <ContactInfo>
      <p>Вопросы разработчику игры вы можете задать:</p>
      {game.contactsTelegram && (
        <ContactLink href={`https://t.me/${game.contactsTelegram}`} target="_blank">
          <FaTelegramPlane /> @{game.contactsTelegram}
        </ContactLink>
      )}
      {game.contactsWhatsapp && (
        <ContactLink href={`https://wa.me/${game.contactsWhatsapp}`} target="_blank">
          <FaWhatsapp /> {game.contactsWhatsapp}
        </ContactLink>
      )}
      {game.contactsEmail && (
        <ContactLink href={`mailto:${game.contactsEmail}`}>
          <FaEnvelope /> {game.contactsEmail}
        </ContactLink>
      )}
      {game.contactsPhone && (
        <ContactLink href={`tel:${game.contactsPhone}`}>
          <FaPhoneAlt /> {game.contactsPhone}
        </ContactLink>
      )}
    </ContactInfo>
  );
};

export default DeveloperContacts;
