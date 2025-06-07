'use client';
import React from 'react';
import styled from 'styled-components';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { MdSort } from 'react-icons/md';

const Container = styled.div`
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1em 0.75em;
  border-radius: 5px;
  font-weight: bold;
  background: inherit;
  border: 1px solid rgb(var(--background));
  color: ${({ $isOpen }) => ($isOpen ? 'rgb(var(--foreground))' : 'rgb(var(--theme-grey))')};

  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

const ArrowWrapper = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const List = styled.div`
  margin-top: 10px;
  padding: 0.25em 0.5em;
`;

const ListItem = styled.label`
  display: flex;
  align-items: center;
  padding: 5px 0;
  gap: 0.5rem;

  input {
    accent-color: rgb(var(--theme-yellow));
  }
`;

const ResetButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(var(--theme-grey), 0.8);
  font-size: 14px;
  padding: 5px 0;
  cursor: pointer;

  &:hover {
    color: rgb(var(--theme-yellow));
    text-decoration: underline;
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
  return (
    <Container>
      <Header
        $isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ position: 'relative' }}
      >
        {/* Left icon */}
        <div style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
          <MdSort />
        </div>

        {/* Centered label */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {sortLabelMap[sort] || 'По популярности'}
        </div>

        {/* Right arrow */}
        <ArrowWrapper>
          <FiArrowUp
            onClick={(e) => {
              e.stopPropagation();
              onChangeOrder('asc');
            }}
            style={{
              color: sortOrder === 'asc' ? 'rgb(var(--theme-yellow))' : 'inherit',
              marginRight: '0.25rem',
              cursor: 'pointer',
            }}
          />
          <FiArrowDown
            onClick={(e) => {
              e.stopPropagation();
              onChangeOrder('desc');
            }}
            style={{
              color: sortOrder === 'desc' ? 'rgb(var(--theme-yellow))' : 'inherit',
              cursor: 'pointer',
            }}
          />
        </ArrowWrapper>
      </Header>

      {isOpen && (
        <List>
          {items.map((item) => (
            <ListItem key={item.value}>
              <input
                type="radio"
                name="sort"
                value={item.value}
                checked={sort === item.value}
                onChange={() => {
                  onToggleSort(item.value);
                  setIsOpen(false);
                }}
              />

              {item.label}
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default SortDropdown;
