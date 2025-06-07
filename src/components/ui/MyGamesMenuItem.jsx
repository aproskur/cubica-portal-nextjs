'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFilters } from '@/context/FiltersContext';

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

  return (
    <button
      onClick={handleClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        color: 'inherit',
        textDecoration: 'none',
        font: 'inherit',
        ...style,
      }}
    >
      Мои игры
    </button>
  );
};

export default MyGamesMenuItem;
