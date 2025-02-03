"use client"
import { games } from "@/data/games";
import Head from "next/head";
import Swiper from "@/components/Swiper";
import styled from "styled-components";
import { use } from "react";
import Tabs from "@/components/Tabs"
import InfoContainer from "@/components/InfoContainer";



const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    grid-template-rows: auto auto; /* First for slider + info, second for tabs */
    width: 100%;
    margin: 0 auto;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
`;


const FirstRow = styled.div`
width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr; /* Matches the second row's column setup */
    gap: 20px;
    justify-content: space-around;
    grid-row: 1;
    grid-column: 1 / span 2;
    align-items: stretch;
`;

const SliderContainer = styled.div`
    grid-column: 1; 
    padding: 0; 
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    gap: 10px;
    background-color: inherit;
    color: #fff;
    padding: 20px;
    /* border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); */
`;

const InfoContainerWrapper = styled.div`
    grid-column: 2; 
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: flex-start; 
`;

const SecondRow = styled.div`
    grid-column: 1 / span 2; 
    padding-top: 1em;
    border-radius: 10px;
    grid-row: 2;
`;





const GamePage = ({ params: paramsPromise }) => {
    const params = use(paramsPromise); // Unwrap the params Promise
    const { slug } = params; // Access slug from unwrapped params

    const game = games.find((g) => g.slug === slug);

    if (!game) {
        return <div>Game not found</div>;
    }

    return (
        <>
            <Head>
                <title>Страница игры {game.title}</title>
            </Head>

            <GridContainer>
                {/* First Row */}
                <FirstRow>
                    <SliderContainer>
                        <Swiper images={game.images} />
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
                        />
                    </InfoContainerWrapper>
                </FirstRow>


                {/* Second Row */}
                <SecondRow>
                    <Tabs />
                </SecondRow>
            </GridContainer>

        </>
    );
};

export default GamePage;
