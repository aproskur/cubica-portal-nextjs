"use client"
import Head from "next/head";
import Swiper from "@/components/Swiper";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Tabs from "@/components/Tabs"
import InfoContainer from "@/components/InfoContainer";
import { useParams } from "next/navigation";
import { fetchGameBySlug } from "@/utils/apiService";
import { useModal } from "@/context/ModalContext";


const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    grid-template-rows: auto auto; /* First row (slider + info), second row (tabs) */
    width: 100%;
    max-width: 100vw;
    margin: 0 auto;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
    grid-template-areas: 
        "slider info"
        "tabs tabs";

    /* Mobile layout */
    @media (max-width: 875px) {
        grid-template-columns: 1fr; 
        grid-template-rows: auto auto auto; 
        grid-template-areas: 
            "info"
            "slider"
            "tabs";
        gap: 15px;
    }
`;

const FirstRow = styled.div`
    width: 100%;
    display: contents; 
    
`;

const SliderContainer = styled.div`
    grid-area: slider;
    display: flex;
    width: 100%;
    height: auto;
    flex-direction: column;
    gap: 10px;
    background-color: inherit;
    color: #fff;
    padding: 20px;
    overflow: hidden;
`;

const InfoContainerWrapper = styled.div`
    grid-area: info;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`;

const SecondRow = styled.div`
    grid-area: tabs;
    padding-top: 1em;
    border-radius: 10px;
`;





const GamePage = () => {
    const { slug } = useParams(); // Get slug from URL
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    const { openPurchaseModal, setIsModalOpen } = useModal();

    useEffect(() => {
        const fetchGame = async () => {
            const gameData = await fetchGameBySlug(slug);
            setGame(gameData);
            setLoading(false);
            console.log("Row game data, fetcehed by gamePage", gameData)
        };

        fetchGame();
    }, [slug]);


    const handleModalsBuyClick = (game) => {
        openPurchaseModal(game);

    }

    if (loading) return <p>Загрузка...</p>;
    if (!game) return <p>Игра не найдена</p>;

    const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const imageUrlArray = game.images.map(image => ({
        id: image.id,
        url: `${API_URL}${image.url}`,
    }));




    return (
        <>
            <Head>
                <title>{game.title}</title>
            </Head>
            <GridContainer>
                <FirstRow>
                    <SliderContainer>
                        <Swiper images={imageUrlArray} />
                    </SliderContainer>
                    <InfoContainerWrapper>
                        <InfoContainer
                            title={game.title}
                            rating={game.rating}
                            reviews={game.reviews}
                            priceLaunch={game.pricePerLaunch}
                            priceMonth={game.pricePerMonth}
                            description={game.description}
                            details={{
                                genre: game.genre,
                                format: game.format,
                                duration: game.duration,
                                author: game.author,
                            }}
                            onBuyClick={() => handleModalsBuyClick(game)}
                        />
                    </InfoContainerWrapper>
                </FirstRow>
                <SecondRow>
                    <Tabs game={game} />
                </SecondRow>
            </GridContainer>
        </>
    );
};



export default GamePage;
