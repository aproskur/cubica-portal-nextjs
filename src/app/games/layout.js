"use client"
import React from "react";
import Header from "@/components/Header";
import Aside from "@/components/Aside";
import styled from "styled-components";



const FlexWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    gap: 20px; 
`;

const Content = styled.div`
    flex: 1; 
    overflow: auto; 
`;

export default function GameLayout({ children }) {
    return (
        <main>
            <Header />
            <FlexWrapper>
                <Aside type="game-page" />
                <Content>
                    {children}
                </Content>
            </FlexWrapper>
        </main>
    );
}

