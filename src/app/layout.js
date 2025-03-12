import StyledComponentsRegistry from "../lib/registry";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/context/Providers";
import Header from "@/components/Header";
import Aside from "@/components/Aside";
import PurchaseModal from "@/components/PurchaseModal";
import ClientWrapperAuth from "@/components/ClientWrapperAuth";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "Главная | Магазин игр",
  description: "Добро пожаловать в Магазин игр - лучший портал для игр.",
};


export default function RootLayout({ children }) {

  return (
    <html lang="ru">
      <body className={`${montserrat.variable}`}>
        <StyledComponentsRegistry>
          <Providers>
            <Header />
            <div className="flex-wrapper">
              <Aside />
              <div className="content">{children}</div>
            </div>
            <PurchaseModal />
            <ClientWrapperAuth />
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
