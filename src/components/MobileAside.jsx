import styled, { keyframes } from 'styled-components';
import { FiX } from 'react-icons/fi';
import Dropdown from './ui/Dropdown';
import { FiFilter } from 'react-icons/fi';
import useAsideFilters from '@/hooks/useAsideFilters';
import { useFilters } from '@/context/FiltersContext';

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

const Heading2 = styled.h2`
  text-align: center;
`;
const FilterGroup = styled.div`
  margin-top: 1rem;
`;

const ApplyButton = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(var(--theme-yellow), 0.5);
  background: inherit;
  color: rgb(var(--foreground));
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

const MobileAside = ({ isOpen, onClose, asideType = 'main' }) => {
  const { dropdownState, setDropdownState, competencies, filters, handleToggleCompetency } =
    useAsideFilters();

  const { filters: purchaseFilters, updateFilters: updatePurchaseFilters } = useFilters();

  if (asideType === 'my-purchases') {
    return (
      <MobileAsideContainer $isOpen={isOpen}>
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>
        <FilterGroup>
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
            onCheckboxToggle={(value) => updatePurchaseFilters({ linkStatus: value })}
            selectedValue={purchaseFilters.linkStatus}
          />
        </FilterGroup>
        <ApplyButton onClick={onClose}>Применить</ApplyButton>
      </MobileAsideContainer>
    );
  }

  //default aside
  return (
    <MobileAsideContainer $isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <FiX />
      </CloseButton>
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
      <ApplyButton onClick={onClose}>Применить</ApplyButton>
    </MobileAsideContainer>
  );
};

export default MobileAside;
