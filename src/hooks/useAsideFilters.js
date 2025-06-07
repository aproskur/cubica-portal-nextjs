// hooks/useAsideFilters.js
import { useEffect, useState } from 'react';
import { useFilters } from '@/context/FiltersContext';
import { fetchAllCompetencies } from '@/utils/apiService';

export default function useAsideFilters() {
  const [dropdownState, setDropdownState] = useState({
    sort: false,
    filter: true,
    gameGenre: false,
    showLinks: true,
  });

  const [competencies, setCompetencies] = useState([]);
  const { filters, updateFilters } = useFilters();

  useEffect(() => {
    const loadCompetencies = async () => {
      const fetched = await fetchAllCompetencies();
      setCompetencies(fetched);
    };
    loadCompetencies();
  }, []);

  const handleToggleSort = (value) => {
    if (value === 'RESET_ALL' || value === '') {
      updateFilters({ sort: '', sortOrder: 'asc' });
    } else {
      updateFilters({ sort: value });
    }
  };

  const handleToggleCompetency = (id) => {
    if (id === 'RESET_ALL') {
      updateFilters({ competencies: [] });
      return;
    }
    const isActive = filters.competencies.includes(String(id));
    const updated = isActive
      ? filters.competencies.filter((val) => String(val) !== String(id))
      : [...filters.competencies.map(String), String(id)];

    updateFilters({ competencies: updated });
  };

  return {
    dropdownState,
    setDropdownState,
    competencies,
    filters,
    updateFilters,
    handleToggleSort,
    handleToggleCompetency,
  };
}
