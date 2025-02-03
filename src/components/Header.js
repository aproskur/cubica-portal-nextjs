"use client"
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { LuLogIn } from "react-icons/lu";
import { FiMenu } from "react-icons/fi";
import Logo from "@/components/Logo"

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;

  background-color: inherit;
  color: rgb(var(--foreground));
  height: 77px;
  box-shadow: 0 15px 10px -18px #2a323d;
`;

const LeftContainer = styled.div`
width: 285px;
display: flex;
  justify-content: space-between;
  align-items: center;


`;

const RightContainer = styled.div`
display: flex;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
  padding-left: 70px; 

`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgb(var(--theme-grey)); 
  transition: color 0.3s ease-in-out; 

  &:hover {
    color: rgb(var(--theme-yellow)); 
  }
`;

/* Invisible hover buffer to prevent menu flickering */
const HoverBuffer = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  width: 100px;  /* Extend width of hoverable area */
  height: 30px;  /* Small invisible hover area */
  background: transparent; /* Ensure it is invisible */
  z-index: 99; /* Keeps it above other elements */
`;

const BurgerWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const BurgerIcon = styled(FiMenu)`
  width: 40px; 
  height: 40px;
  stroke-width: 2.5; 
  font-size: 24px;
  color: rgb(var(--theme-yellow));
`;

const MenuPopup = styled.div`
  position: absolute;
  top: 25px;
  left: 0;
  background: rgb(var(--background));
  border-radius: 8px;
  border: 1px solid rgba(var(--theme-yellow), 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  min-width: 250px;
  z-index: 100;
  
  opacity: ${(props) => (props.$isVisible ? "1" : "0")};
  transform: ${(props) => (props.$isVisible ? "translateY(0)" : "translateY(-10px)")};
  visibility: ${(props) => (props.$isVisible ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0.3s ease-in-out;

  a {
    color: rgb(var(--foreground));
    text-decoration: none;
    display: block;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid transparent;
    box-sizing: border-box;

    &:hover {
      background: #333333;
      border: 1px solid rgb(var(--theme-yellow));
    }
  }
`;


const PageName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const LoginIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgb(var(--theme-grey));
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;


  svg {
    font-size: 20px;
    color: rgb(var(--foreground))
    transition: color 0.3s ease-in-out;
  }

  &:hover svg {
   color: rgb(var(--theme-yellow));
  }
`;


const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [pageName, setPageName] = useState("");

  useEffect(() => {
    // Dynamically retrieve the page title from the document's <title>
    const title = document.title;
    setPageName(title);
  }, []);

  return (
    <HeaderContainer>
      <LeftContainer>
        {/* Logo */}
        <LogoWrapper>
          <Link href="/">
            <Logo width={150} height={70}> </Logo>
          </Link>
        </LogoWrapper>

        {/* Burger Icon and Menu */}
        <BurgerWrapper
          onMouseEnter={() => setMenuVisible(true)}
          onMouseLeave={() => setMenuVisible(false)}
        >
          <BurgerIcon />
          <HoverBuffer>
            <MenuPopup $isVisible={menuVisible}
              onMouseEnter={() => setMenuVisible(true)}
              onMouseLeave={() => setMenuVisible(false)}>
              <Link href="/option1" passHref>
                О платформе
              </Link>
              <Link href="/option2" passHref>
                Поддержка
              </Link>
            </MenuPopup>
          </HoverBuffer>
        </BurgerWrapper>

      </LeftContainer>
      <RightContainer>
        {/* Page Name */}
        <PageName>{pageName}</PageName>

        {/* User Icon */}
        <LoginIconWrapper>
          <LuLogIn />
        </LoginIconWrapper>
      </RightContainer>


    </HeaderContainer>
  );
};

export default Header;
