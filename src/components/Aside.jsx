'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import SortDropdown from '@/components/ui/SortDropdown';
import useAsideFilters from '@/hooks/useAsideFilters';
import Dropdown from './ui/Dropdown';
import { FaTelegramPlane, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useGamesData } from '@/context/GamesDataContext';

const AsideContainer = styled.aside`
  width: 350px;
  flex-shrink: 0;
  background-color: inherit;
  color: inherit;
  padding: 0.5rem 1rem;

  /* Is needed if menu is sticky */
  @media (max-width: 875px) {
    padding: 110px 5px;
  }
`;
const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem; /* Left padding for icon */
  margin-bottom: 1rem;
  border: 1px solid rgba(var(--theme-yellow), 0.5);
  border-radius: 90px;
  font-size: 16px;
  outline: none;
  background: inherit;
  color: inherit;

  &:focus {
    border-color: rgb(var(--theme-yellow));
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 10px;
  top: 37%;
  transform: translateY(-50%);
  font-size: 20px;
  color: rgba(var(--theme-grey), 0.7);
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: rgb(var(--theme-yellow));
  border-bottom: 1px solid rgba(var(--theme-yellow), 0.4);
  padding: 1.2rem;
`;

const FilterGroup = styled.div``;

const ResetDropdownButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(var(--theme-grey), 0.8);
  font-size: 14px;
  padding: 5px 0;
  margin-top: 5px;
  cursor: pointer;
  text-align: left;

  &:hover {
    color: rgb(var(--theme-yellow));
    text-decoration: underline;
  }
`;

const ContactInfo = styled.div`
  margin-top: 2rem;
  font-size: 14px;
  line-height: 1.6;
  color: rgb(var(--foreground));
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;

  color: rgb(var(--foreground));
  text-decoration: none;

  &:hover {
    color: rgb(var(--theme-yellow));
    text-decoration: none;
  }
`;

const Aside = () => {
  const {
    dropdownState,
    setDropdownState,
    competencies,
    filters,
    handleToggleSort,
    handleToggleCompetency,
    updateFilters,
  } = useAsideFilters();

  const [isMobile, setIsMobile] = useState(false);

  const { currentGame } = useGamesData();

  const {
    contactsTelegram = '',
    contactsWhatsapp = '',
    contactsEmail = '',
    contactsPhone = '',
  } = currentGame || {};

  console.log('CURRENT GAME from aside', currentGame);

  const pathname = usePathname();
  let asideType = 'game-page'; // Default type
  if (pathname === '/games/my') {
    asideType = 'my-purchases';
  } else if (pathname === '/') {
    asideType = 'main';
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 875);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) return null;

  if (asideType === 'main') {
    return (
      <AsideContainer>
        <SectionTitle>Поиск</SectionTitle>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Введите название игры..."
            onChange={(e) => updateFilters({ searchQuery: e.target.value.toLowerCase() })}
          />
        </SearchContainer>
        <FilterGroup>
          <SectionTitle>Сортировка</SectionTitle>
          <SortDropdown
            sort={filters.sort}
            sortOrder={filters.sortOrder}
            onToggleSort={handleToggleSort}
            onChangeOrder={(order) => updateFilters({ sortOrder: order })}
            isOpen={dropdownState.sort}
            setIsOpen={(val) => setDropdownState((prev) => ({ ...prev, sort: val }))}
            items={[
              { label: 'По алфавиту', value: 'alphabet' },
              { label: 'По популярности', value: 'popularity' },
              { label: 'По рейтингу', value: 'rating' },
              { label: 'По длительности', value: 'duration' },
              { label: 'По стоимости', value: 'price' },
              { label: 'По дате публикации', value: 'date' },
            ]}
          />
        </FilterGroup>
        <SectionTitle>Фильтры</SectionTitle>
        <FilterGroup>
          {competencies.length > 0 && (
            <Dropdown
              title="Компетенции"
              icon={<FiFilter />}
              type="checkbox"
              stateKey="filter"
              dropdownState={dropdownState}
              setDropdownState={setDropdownState}
              items={competencies.map((c) => ({
                label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
                value: c.id,
              }))}
              onCheckboxToggle={handleToggleCompetency}
              selectedValues={filters.competencies} // <-- for rendering checked state
            />
          )}
        </FilterGroup>
      </AsideContainer>
    );
  }
  if (asideType === 'game-page') {
    return (
      <AsideContainer>
        <SectionTitle>Контакты</SectionTitle>
        <ContactInfo>
          Вопросы разработчику игры вы можете задать:
          {contactsTelegram && (
            <ContactLink
              href={`https://t.me/${contactsTelegram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTelegramPlane />в телеграм
            </ContactLink>
          )}
          {contactsWhatsapp && (
            <ContactLink
              href={`https://wa.me/${contactsWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />в вотсап
            </ContactLink>
          )}
          {contactsEmail && (
            <ContactLink href={`mailto:${contactsEmail}`}>
              <FaEnvelope />
              написать на почту: {contactsEmail}
            </ContactLink>
          )}
          {contactsPhone && (
            <ContactLink href={`tel:${contactsPhone}`}>
              <FaPhoneAlt />
              позвонить: {contactsPhone}
            </ContactLink>
          )}
        </ContactInfo>
      </AsideContainer>
    );
  }

  if (asideType === 'my-purchases') {
    return (
      <AsideContainer>
        <SectionTitle>Поиск</SectionTitle>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Введите название игры..."
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </SearchContainer>
        <FilterGroup>
          <SectionTitle>Фильтр ссылок</SectionTitle>
          <Dropdown
            title="Отображать ссылки"
            icon={<FiFilter />}
            type="radio"
            stateKey="showLinks"
            dropdownState={dropdownState}
            setDropdownState={setDropdownState}
            items={[
              { label: 'Все', value: 'all-links' },
              { label: 'Активные', value: 'active-links' },
              { label: 'Архивные', value: 'archive-links' },
            ]}
          />
        </FilterGroup>
      </AsideContainer>
    );
  }

  return null;
};

export default Aside;
