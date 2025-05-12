'use client'
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiChevronDown, FiChevronUp, FiFilter, FiSearch } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { fetchAllCompetencies } from "@/utils/apiService";
import { useFilters, updateFilters } from "@/context/FiltersContext";
import { BiSortAlt2 } from "react-icons/bi";

const AsideContainer = styled.aside`
  width: 350px;
  flex-shrink: 0;
  background-color: inherit;
  color: inherit;
  padding: 0.5rem 1rem;

  /* Is needed if menu is sticky */
  @media(max-width: 875px ){
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
  padding: 1.20rem ;
`;

const FilterGroup = styled.div`

`;

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
  border: ${({ $isOpen }) => ($isOpen ? "1px solid rgb(var(--theme-yellow))" : "1px solid rgb(var(--background))")}; 
  border-radius: 5px;
  padding: 1em .5em;
  font-weight: bold;
  color: ${({ $isOpen }) => ($isOpen ? "rgb(var(--foreground))" : "rgb(var(--theme-grey))")};
  

  &:hover {
   border: 1px solid rgb(var(--theme-yellow));
  }
`;

const DropdownList = styled.div`
  margin-top: 10px;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding: .25em .5em;

`;


const DropdownListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;
  cursor: pointer;
  gap: 5px;


  input {
    margin-right: 10px;
    accent-color: rgb(var(--theme-yellow));
  }
`;

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







const stopPropagation = (event) => {
    event.stopPropagation();
};





// Reusable Dropdown Component
const Dropdown = ({ title, 
                    icon, 
                    items, 
                    type, 
                    stateKey, 
                    dropdownState, 
                    setDropdownState,
                    onCheckboxToggle,     
                    selectedValues = [],
                    sortOrder,            
                    setSortOrder  }) => {
    const isOpen = dropdownState[stateKey];


    return (
        <DropdownContainer>
            <DropdownHeader onClick={() => setDropdownState(prev => ({ ...prev, [stateKey]: !prev[stateKey] }))} $isOpen={isOpen}>
                {icon}
                <span>{title}</span>
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </DropdownHeader>
            <DropdownList $isOpen={isOpen}>
            {Array.isArray(items) &&
 items.map((item, index) => {
    if (!item || !item.value) return null; // defensive guard

    const isSelected = selectedValues.includes(String(item.value));
    const isSortDropdown = stateKey === "sort";

    return (
        <DropdownListItem key={index}>
        <div className="label-content">
          <input
            type={type}
            name={stateKey}
            value={item.value}
            onClick={stopPropagation}
            checked={isSelected}
            onChange={() => onCheckboxToggle?.(item.value)}
          />
          {item.label}
        </div>
      
        {isSortDropdown && isSelected && (
          <BiSortAlt2
            className="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSortOrder?.(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          />
        )}
      </DropdownListItem>
      
    );
 })}
            </DropdownList>
            {isOpen && stateKey === "sort" && (
  <ResetDropdownButton
    onClick={(e) => {
      e.stopPropagation();
      onCheckboxToggle?.("");
      setSortOrder?.("asc");
    }}
  >
    Сбросить сортировку
  </ResetDropdownButton>
)}

{isOpen && type === "checkbox" && stateKey === "filter" && (
  <ResetDropdownButton
    onClick={(e) => {
      e.stopPropagation();
      onCheckboxToggle?.("RESET_ALL");
    }}
  >
    Сбросить фильтры
  </ResetDropdownButton>
)}


        </DropdownContainer>
    );
};

const Aside = () => {
    const [dropdownState, setDropdownState] = useState({
        sort: true,
        filter: true,
        gameGenre: false,
        showLinks: true,
      });
      

    const [isMobile, setIsMobile] = useState(false);
    const [competencies, setCompetencies] = useState([]);
    const { filters, updateFilters } = useFilters();

    const pathname = usePathname();
    let asideType = "game-page"; // Default type
    if (pathname === "/games/my") {
        asideType = "my-purchases";
    } else if (pathname === "/") {
        asideType = "main";
    }

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 875);
        };

        checkScreenSize(); // Initial check
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);


    useEffect(() => {
        const loadCompetencies = async () => {
            const fetchedCompetencies = await fetchAllCompetencies();
            setCompetencies(fetchedCompetencies);
        }       
        loadCompetencies();
    },[]

    );

    const handleToggleSort = (value) => {
        if (value === "RESET_ALL" || value === "") {
          updateFilters({ sort: "", sortOrder: "asc" });
        } else {
          updateFilters({ sort: value });
        }
      };
      

    const handleToggleCompetency = (id) => {
        if (id === "RESET_ALL") {
            updateFilters({ competencies: [] });
            return;
          }
          const isActive = filters.competencies.includes(String(id));
          const updated = isActive
          ? filters.competencies.filter((val) => String(val) !== String(id))
          : [...filters.competencies.map(String), String(id)];
          
      
        updateFilters({ competencies: updated }); // Update the global filter state
      };
      

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
                    <Dropdown
  title="Тип сортировки"
  icon={<FiFilter />}
  type="radio"
  stateKey="sort"
  dropdownState={dropdownState}
  setDropdownState={setDropdownState}
  selectedValues={[filters.sort]}
  onCheckboxToggle={handleToggleSort}
  sortOrder={filters.sortOrder}
  setSortOrder={(order) => updateFilters({ sortOrder: order })}
  items={[
    { label: "По алфавиту", value: "alphabet" },
    { label: "По популярности", value: "popularity" },
    { label: "По рейтингу", value: "rating" },
    { label: "По длительности", value: "duration" },
    { label: "По стоимости", value: "price" },
    { label: "По дате публикации", value: "date" }
  ]}
/>


                </FilterGroup>
                <SectionTitle>Фильтры</SectionTitle>
                <FilterGroup>
                    {console.log("Competencies from aside", competencies)}
                    {   
                        competencies.length > 0 && 
                        <Dropdown
                        title="Компетенции"
                        icon={<FiFilter />}
                        type="checkbox"
                        stateKey="filter"
                        dropdownState={dropdownState}
                        setDropdownState={setDropdownState}
                        items = {
                            competencies.map((c) => ({
                                label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
                                value: c.id
                            }))
                        }
                        onCheckboxToggle={handleToggleCompetency} 
                        selectedValues={filters.competencies}     // <-- for rendering checked state
                   
                    />
                    }
                </FilterGroup>

            </AsideContainer>
        );
    }
    if (asideType === 'game-page') {
        return (
            <AsideContainer>


                ПОИСК
            </AsideContainer>
        );
    }

    if (asideType === "my-purchases") {
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
                            { label: "Все", value: "all-links" },
                            { label: "Активные", value: "active-links" },
                            { label: "Архивные", value: "archive-links" },
                        ]}
                    />
                </FilterGroup>
            </AsideContainer>
        );
    }

    return null;

};

export default Aside;
