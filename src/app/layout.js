import StyledComponentsRegistry from '../lib/registry';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Providers from '@/context/Providers';
import Header from '@/components/Header';
import Aside from '@/components/Aside';
import PurchaseModal from '@/components/modals/PurchaseModal';
import ClientWrapperAuth from '@/components/ClientWrapperAuth';
import ClientPaymentRedirectHandler from '@/utils/ClientPaymentRedirectHandler';
import { Suspense } from 'react';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata = {
  title: 'Главная | Магазин игр',
  description: 'Добро пожаловать в Магазин игр - лучший портал для игр.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <StyledComponentsRegistry>
          <Providers>
            <Header />
            <div className="flex-wrapper">
              <Aside />
              <div className="content">{children}</div>
            </div>
            <PurchaseModal />
            <Suspense fallback={null}>
              <ClientPaymentRedirectHandler />
            </Suspense>
            <ClientWrapperAuth />
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
