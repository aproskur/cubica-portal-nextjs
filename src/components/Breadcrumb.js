"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { fetchGameBySlug } from "@/utils/apiService";


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

const breadcrumbTranslations = {
    home: "Магазин игр",
    launch: "Запуск",
    my: "Мои покупки"
};


const FlexItemWarapper = styled.div`
flex-shrink: 0;
`;

const Breadcrumbs = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);
    const filteredSegments = pathSegments.filter((segment) => segment !== "games");

    const [titles, setTitles] = useState({});
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
                    const game = await fetchGameBySlug(segment);
                    console.log("Game for breadcrumb:", game);
                    updatedTitles[segment] = game?.title || segment.replace(/-/g, " ");
                } catch (err) {
                    console.error("Error fetching game for breadcrumb:", segment, err);
                    updatedTitles[segment] = segment.replace(/-/g, " ");
                }
            }

            setTitles(updatedTitles);
        };

        fetchTitles();
    }, [pathname]);


    return (
        <BreadcrumbContainer>
            <FlexItemWarapper>
                <BreadcrumbLink href="/">Магазин игр</BreadcrumbLink>
            </FlexItemWarapper>
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
