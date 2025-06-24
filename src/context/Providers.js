'use client';
import { SearchProvider } from '@/context/SearchContext';
import { AuthProvider } from '@/context/AuthContext';
import { GamesDataProvider } from '@/context/GamesDataContext';
import { ModalProvider } from './ModalContext';
import { FiltersProvider } from './FiltersContext';
import { ToastProvider } from './ToastContext';

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <FiltersProvider>
          <GamesDataProvider>
            <SearchProvider>
              <ModalProvider>{children}</ModalProvider>
            </SearchProvider>
          </GamesDataProvider>
        </FiltersProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
