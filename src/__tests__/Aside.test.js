import { render, screen, fireEvent } from '@testing-library/react';
import Aside from '@/components/Aside';

// Mock Next.js routing
jest.mock('next/navigation', () => ({
  usePathname: () => '/', // simulate "main" page
}));

// Mock context
const updateFiltersMock = jest.fn();
jest.mock('@/context/FiltersContext', () => ({
  useFilters: () => ({
    filters: {
      sort: '',
      sortOrder: 'asc',
      competencies: [],
    },
    updateFilters: updateFiltersMock,
  }),
}));

// Mock API fetch
jest.mock('@/utils/apiService', () => ({
  fetchAllCompetencies: jest.fn(() =>
    Promise.resolve([
      { id: 'qwerty', name: 'logic' },
      { id: 'asdfg', name: 'strategy' },
    ])
  ),
}));

describe('Aside rendering', () => {
  it('renders search input on main page', async () => {
    render(<Aside />);
    const input = await screen.findByPlaceholderText(/введите название/i);
    expect(input).toBeInTheDocument();
  });

  it('renders "Тип сортировки" dropdown', async () => {
    render(<Aside />);
    expect(await screen.findByText(/Тип сортировки/i)).toBeInTheDocument();
  });

  it('renders competency filter title after fetching data', async () => {
    render(<Aside />);
    expect(await screen.findByText(/Компетенции/i)).toBeInTheDocument();
  });
});

describe('Aside interactions', () => {
  it('toggles sort dropdown on header click', async () => {
    render(<Aside />);
    const header = await screen.findByText(/Тип сортировки/i);
    fireEvent.click(header); // Simulate opening dropdown
    const option = await screen.findByText(/По алфавиту/i);
    expect(option).toBeInTheDocument(); // Dropdown content appears
  });

  it('updates filters when search input changes', async () => {
    render(<Aside />);
    const input = await screen.findByPlaceholderText(/введите название/i);
    fireEvent.change(input, { target: { value: 'тест' } });

    // Since debounce isn't in use, this will be called immediately
    expect(updateFiltersMock).toHaveBeenCalledWith({
      searchQuery: 'тест',
    });
  });
});
