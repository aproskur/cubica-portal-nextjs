"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { fetchGameBySlug } from "@/utils/apiService";
import { useAuth } from "@/context/AuthContext";
import AboutPlatform from "@/app/about-platform/page";

const BreadcrumbContainer = styled.nav`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgb(var(--foreground));
`;

const BreadcrumbLink = styled(Link)`
  color: rgb(var(--theme-yellow));
  text-decoration: none;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: rgb(var(--foreground));
  }
`;

const ActiveBreadcrumb = styled.span`
  font-weight: normal;
  color: rgb(var(--foreground));
`;

const FlexItemWrapper = styled.div`
  flex-shrink: 0;
`;

const breadcrumbTranslations = {
    home: "Магазин игр",
    launch: "Запуск",
    my: "Мои покупки",
    support: "Поддержка",
    "about-platform": "О платформе"
};

const Breadcrumbs = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);
    const filteredSegments = pathSegments.filter((segment) => segment !== "games");

    const [titles, setTitles] = useState({});
    const { token } = useAuth(); // get token if available

    useEffect(() => {
        const fetchTitles = async () => {
            const updatedTitles = { ...titles };

            for (const segment of filteredSegments) {
                if (updatedTitles[segment]) continue;

                const staticLabel = breadcrumbTranslations[segment];
                if (staticLabel) {
                    updatedTitles[segment] = staticLabel;
                    continue;
                }

                try {
                    const game = await fetchGameBySlug(segment, token); // ✅ use token here
                    updatedTitles[segment] = game?.title || segment.replace(/-/g, " ");
                } catch (err) {
                    console.warn(`Breadcrumb failed for "${segment}":`, err.message);
                    // fallback for restricted or missing games
                    updatedTitles[segment] = "Недоступная игра";
                }
            }

            setTitles(updatedTitles);
        };

        fetchTitles();
    }, [pathname, token]); // ✅ include token as dependency

    return (
        <BreadcrumbContainer>
            <FlexItemWrapper>
                <BreadcrumbLink href="/">Магазин игр</BreadcrumbLink>
            </FlexItemWrapper>
            {filteredSegments.map((segment, index) => {
                const path = `/${filteredSegments.slice(0, index + 1).join("/")}`;
                const name = titles[segment] || segment;

                return (
                    <span key={path}>
                        {" > "}
                        {index === filteredSegments.length - 1 ? (
                            <ActiveBreadcrumb>{name}</ActiveBreadcrumb>
                        ) : (
                            <BreadcrumbLink href={path}>{name}</BreadcrumbLink>
                        )}
                    </span>
                );
            })}
        </BreadcrumbContainer>
    );
};

export default Breadcrumbs;
