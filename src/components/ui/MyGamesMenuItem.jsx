'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFilters } from '@/context/FiltersContext';
import styled from 'styled-components';

/*
const StyledButton = styled.button`
  all: unset;
  cursor: pointer;
  color: rgb(var(--foreground));
  text-decoration: none;
  font-size: 18px;
  border-radius: 5px;
  padding: 0.5em;
  transition: background 0.3s ease-in-out;
  border: 1px solid rgb(var(--background));

  &:hover {
    color: rgb(var(--theme-yellow));
  }
`; */

const StyledButton = styled.button`
  all: unset;
  cursor: pointer;
  color: inherit;
  font: inherit;
  width: 100%;
  height: 100%;
  font-size: 18px;
`;

const MyGamesMenuItem = ({ asButton = false, style = {}, onClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { filters, updateFilters } = useFilters();

  if (!isAuthenticated) return null;

  const handleClick = () => {
    const toggle = !filters.onlyMyDevelopedGames;

    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        updateFilters({ onlyMyDevelopedGames: toggle });
        if (onClick) onClick();
      }, 0);
    } else {
      updateFilters({ onlyMyDevelopedGames: toggle });
      if (onClick) onClick();
    }
  };

  return <StyledButton onClick={handleClick}>Мои игры</StyledButton>;
};

export default MyGamesMenuItem;
