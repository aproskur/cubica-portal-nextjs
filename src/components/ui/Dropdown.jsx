// components/ui/Dropdown.js
import React from 'react';
import styled from 'styled-components';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

// Styled Components
const DropdownContainer = styled.div`
  border-radius: 8px;
  position: relative;
  background-color: inherit;
  margin-bottom: 5px;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid rgb(var(--background));
  border-radius: 5px;
  padding: 1em 0.5em;
  font-weight: bold;
  color: ${({ $isOpen }) => ($isOpen ? 'rgb(var(--foreground))' : 'rgb(var(--theme-grey))')};

  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

const DropdownList = styled.div`
  margin-top: 10px;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding: 0.25em 0.5em;
`;

const DropdownListItem = styled.div`
  padding: 0.5em 0;
  cursor: pointer;

  .label-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input {
    cursor: pointer;
  }
`;

const ResetDropdownButton = styled.button`
  margin-top: 10px;
  padding: 0.5em;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  color: rgb(var(--theme-grey));
  cursor: pointer;
  font-size: 0.9em;

  &:hover {
    color: rgb(var(--theme-yellow));
  }
`;

// Utility to stop event bubbling
const stopPropagation = (e) => e.stopPropagation();

// Reusable Dropdown Component
const Dropdown = ({
  title,
  icon,
  items = [],
  type = 'checkbox',
  stateKey,
  dropdownState,
  setDropdownState,
  onCheckboxToggle,
  selectedValues = [],
  selectedValue,
  sortOrder,
  setSortOrder,
}) => {
  const isOpen = dropdownState[stateKey];

  const handleHeaderClick = () => {
    setDropdownState((prev) => ({
      ...prev,
      [stateKey]: !prev[stateKey],
    }));
  };

  const handleReset = (e, action) => {
    e.stopPropagation();
    onCheckboxToggle?.(action);
    if (stateKey === 'sort' && setSortOrder) setSortOrder('asc');
  };

  return (
    <DropdownContainer>
      <DropdownHeader onClick={handleHeaderClick} $isOpen={isOpen}>
        {icon}
        <span>{title}</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </DropdownHeader>

      <DropdownList $isOpen={isOpen}>
        {items.map((item, index) => {
          if (!item || !item.value) return null;

          const isSelected =
            type === 'radio'
              ? selectedValue === String(item.value)
              : selectedValues.includes(String(item.value));

          return (
            <DropdownListItem key={index}>
              <label className="label-content">
                <input
                  type={type}
                  name={stateKey}
                  value={item.value}
                  checked={isSelected}
                  onChange={() => onCheckboxToggle?.(item.value)}
                />
                {item.label}
              </label>
            </DropdownListItem>
          );
        })}
      </DropdownList>

      {isOpen && stateKey === 'sort' && (
        <ResetDropdownButton onClick={(e) => handleReset(e, '')}>
          Сбросить сортировку
        </ResetDropdownButton>
      )}

      {isOpen && type === 'checkbox' && stateKey === 'filter' && (
        <ResetDropdownButton onClick={(e) => handleReset(e, 'RESET_ALL')}>
          Сбросить фильтры
        </ResetDropdownButton>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;
