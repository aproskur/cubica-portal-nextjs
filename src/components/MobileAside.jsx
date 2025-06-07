import styled, { keyframes } from 'styled-components';
import { FiX } from 'react-icons/fi';
import Dropdown from './ui/Dropdown';
import { FiFilter } from 'react-icons/fi';
import useAsideFilters from '@/hooks/useAsideFilters';

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0%);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const MobileAsideContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 100%;
  height: 100vh;
  background: rgb(var(--background));
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.1);
  z-index: 1200;
  padding: 20px;

  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0%)' : 'translateY(100%)')};
  animation: ${({ $isOpen }) => ($isOpen ? slideIn : slideOut)} 0.4s ease-in-out;
  transition: transform 0.4s ease-in-out;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: rgb(var(--theme-yellow));
`;

const FilterGroup = styled.div``;

const MobileAside = ({ isOpen, onClose }) => {
  const { dropdownState, setDropdownState, competencies, filters, handleToggleCompetency } =
    useAsideFilters();

  return (
    <MobileAsideContainer $isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <FiX />
      </CloseButton>
      <h2>Фильтры</h2>
      <p>Здесь будут фильтры...</p>
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
    </MobileAsideContainer>
  );
};

export default MobileAside;
