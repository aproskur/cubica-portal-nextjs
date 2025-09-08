'use client';
import React from 'react';
import styled from 'styled-components';
import { PiSortAscending, PiSortDescending } from 'react-icons/pi';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const Container = styled.div`
  margin-bottom: 1rem;
`;

const Header = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;
  cursor: pointer;
  padding: 1em 0.75em;
  border-radius: 5px;
  font-weight: bold;
  background: inherit;
  font-family: inherit;
  font-size: inherit;
  border: 1px solid rgb(var(--background));
  color: ${({ $isOpen }) => ($isOpen ? 'rgb(var(--foreground))' : 'rgb(var(--theme-grey))')};

  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const Center = styled.div`
  flex: 1 1 auto;
  text-align: center;
  min-width: 0;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const List = styled.div`
  margin-top: 10px;
  padding: 0.25em 0.5em;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const ListItem = styled.label`
  display: flex;
  align-items: center;
  padding: 5px 0;
  gap: 0.5rem;
  cursor: pointer;

  input {
    accent-color: rgb(var(--theme-yellow));
  }
`;

const sortLabelMap = {
  alphabet: 'По алфавиту',
  popularity: 'По популярности',
  rating: 'По рейтингу',
  duration: 'По длительности',
  price: 'По стоимости',
  date: 'По дате публикации',
};

const SortDropdown = ({
  sort,
  sortOrder,
  onToggleSort,
  onChangeOrder,
  isOpen,
  setIsOpen,
  items,
}) => {
  const toggleOpen = () => setIsOpen(!isOpen);
  const keyToggle = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <Container>
      <Header
        type="button"
        $isOpen={isOpen}
        aria-expanded={isOpen}
        aria-controls="sort-dropdown-list"
        onClick={toggleOpen}
        onKeyDown={keyToggle}
      >
        {/* Left: Pi icon toggles order only, not open/close */}
        <Left onClick={(e) => e.stopPropagation()}>
          {sortOrder === 'asc' ? (
            <PiSortAscending
              size={22}
              onClick={() => onChangeOrder('desc')}
              style={{ cursor: 'pointer' }}
              title="Сортировка по возрастанию (нажмите для убывания)"
            />
          ) : (
            <PiSortDescending
              size={22}
              onClick={() => onChangeOrder('asc')}
              style={{ cursor: 'pointer' }}
              title="Сортировка по убыванию (нажмите для возрастания)"
            />
          )}
        </Left>

        {/* Center: label */}
        <Center>{sortLabelMap[sort] || 'По популярности'}</Center>

        {/* Right: chevron indicator */}
        <Right>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</Right>
      </Header>

      <List id="sort-dropdown-list" $isOpen={isOpen}>
        {items.map((item) => (
          <ListItem key={item.value}>
            <input
              type="radio"
              name="sort"
              value={item.value}
              checked={sort === item.value}
              onChange={() => onToggleSort(item.value)} // stays open on select
            />
            {item.label}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default SortDropdown;
