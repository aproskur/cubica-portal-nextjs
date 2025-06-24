'use client';
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { LuLogIn, LuLogOut } from 'react-icons/lu';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from '@/components/ui/Logo';
import Breadcrumbs from './ui/Breadcrumb';
import LoginModal from './modals/LoginModal';
import { AuthContext, useAuth } from '@/context/AuthContext';
import { useGamesData } from '@/context/GamesDataContext';
import { useFilters } from '@/context/FiltersContext';
import UserProfileModal from './modals/UserProfileModal';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import MyGamesMenuItem from './ui/MyGamesMenuItem';

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
  width: 350px;
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
  width: 100px; /* Extend width of hoverable area */
  height: 30px; /* Small invisible hover area */
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

  opacity: ${(props) => (props.$isVisible ? '1' : '0')};
  transform: ${(props) => (props.$isVisible ? 'translateY(0)' : 'translateY(-10px)')};
  visibility: ${(props) => (props.$isVisible ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out,
    visibility 0.3s ease-in-out;

  a {
    color: rgb(var(--foreground));
    text-decoration: none;
    display: block;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid transparent;
    box-sizing: border-box;
    transition:
      background 0.3s ease-in-out,
      border 0.3s ease-in-out;
  }

  a:hover {
    background: #333333;
    border: 1px solid rgb(var(--theme-yellow));
  }

  a:empty {
    display: none;
    pointer-events: none;
  }
`;

const LoginIconWrapper = styled.div`
  position: relative;
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
    color: rgb(var(--foreground));
    transition: color 0.3s ease-in-out;
  }

  &:hover svg {
    color: rgb(var(--theme-yellow));
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background: black;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    top: 45px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
  }
`;

const MenuItemWrapper = styled.div`
  display: block;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
  color: rgb(var(--foreground));

  &:hover {
    background: #333333;
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

/* MOBILE MENU */
const MobileHeaderContainer = styled.header`
  display: none;

  @media (max-width: 875px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: rgb(var(--background));
    height: 100px;
    width: 100vw;
    box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.15);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
`;

const MobileBurgerWrapper = styled.div`
  cursor: pointer;
`;

const CloseIcon = styled(FiX)`
  width: 40px;
  height: 40px;
  color: rgb(var(--theme-yellow));
  transition: color 0.3s ease-in-out;

  &:hover {
    color: rgb(var(--foreground));
  }
`;

const MobileOffCanvasMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 100%;
  height: 100vh;
  background-color: rgb(var(--background));
  box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  transition: right 0.3s ease-in-out;
  z-index: 999;
`;

const MobileOffCanvasMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MobileOffCanavasMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 0.5em;
  width: 100%;
  gap: 20px;
`;

const StyledNextLink = styled(Link).attrs({ as: 'a' })`
  color: rgb(var(--foreground));
  text-decoration: none;
  font-size: 18px;
  border-radius: 5px;
  padding: 0.5em;
  transition: background 0.3s ease-in-out;
  border: 1px solid rgb(var(--background));

  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

const MyGamesMenuItemWrapper = styled.div`
  color: rgb(var(--foreground));
  text-decoration: none;
  font-size: 18px;
  border-radius: 5px;
  padding: 0.5em;
  transition: background 0.3s ease-in-out;
  border: 1px solid rgb(var(--background));
  cursor: pointer;

  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
  }
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgb(var(--theme-grey));
  font-size: 18px;
  cursor: pointer;
  color: rgb(var(--foreground));
  transition: color 0.3s ease-in-out;
  max-width: 150px;
  padding: 0.5em 1em;
  border-radius: 5px;
  gap: 8px;
  margin: 0.5em;

  svg {
    color: rgb(var(--foreground));
    font-size: 20px;
    transition: color 0.3s ease-in-out;
  }

  &:hover {
    color: rgb(var(--theme-yellow));
    border: 1px solid rgb(var(--theme-yellow));
  }

  &:hover svg {
    color: rgb(var(--theme-yellow));
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 1em;
  gap: 1rem;
`;

const FlexWrapperNoGap = styled(FlexWrapper)`
  gap: 0;
`;

const FlexItemWrapper = styled.div`
  flex-shrink: 0;
`;

const MobileBreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgb(var(--background));
  border-bottom: 1px solid rgba(var(--theme-grey), 0.3);
  margin-top: 100px;
  gap: 8px;
`;

const LoggedUserWrapper = styled.div`
  cursor: pointer;
  color: rgb(var(--theme-yellow));
`;

const LoggedUser = ({ onClick }) => {
  const { user, openProfileModal } = useAuth();

  const handleClick = () => {
    if (onClick) {
      onClick(); // expanded
    } else {
      openProfileModal(); // default behavior
    }
  };

  return <LoggedUserWrapper onClick={handleClick}>{user?.username}</LoggedUserWrapper>;
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, handleLogout, openLoginModal } = useContext(AuthContext);
  const { purchasedGames } = useGamesData();
  const { filters, updateFilters } = useFilters();
  const { openProfileModal } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setHasMounted(true); // trigger only on client
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 875);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!hasMounted) return null; // prevent mismatch

  return (
    <>
      {!isMobile && (
        <HeaderContainer>
          <LeftContainer>
            {/* Logo */}
            <LogoWrapper>
              <Link href="/">
                <Logo width={150} height={70}>
                  {' '}
                </Logo>
              </Link>
            </LogoWrapper>

            {/* Burger Icon and Menu */}
            <BurgerWrapper
              onMouseEnter={() => setMenuVisible(true)}
              onMouseLeave={() => setMenuVisible(false)}
            >
              <BurgerIcon />
              <HoverBuffer>
                <MenuPopup
                  $isVisible={menuVisible}
                  onMouseEnter={() => setMenuVisible(true)}
                  onMouseLeave={() => setMenuVisible(false)}
                >
                  <Link href="/about-platform">О платформе</Link>
                  <Link href="/support">Поддержка</Link>
                  {isAuthenticated && purchasedGames.length > 0 && (
                    <StyledNextLink href="/games/my" onClick={() => setMenuOpen(false)}>
                      Мои покупки
                    </StyledNextLink>
                  )}
                  <MenuItemWrapper>
                    <MyGamesMenuItem />
                  </MenuItemWrapper>
                </MenuPopup>
              </HoverBuffer>
            </BurgerWrapper>
          </LeftContainer>
          <RightContainer>
            <FlexWrapperNoGap>
              <Breadcrumbs />
              {pathname === '/' && filters.onlyMyDevelopedGames && (
                <p style={{ textAlign: 'left', marginLeft: '10px' }}>&gt; Мои игры</p>
              )}
            </FlexWrapperNoGap>

            <FlexWrapper>
              {isAuthenticated && purchasedGames.length > 0 ? (
                <StyledNextLink href="/games/my" onClick={() => setMenuOpen(false)}>
                  Мои покупки
                </StyledNextLink>
              ) : null}

              <FlexItemWrapper>
                <MyGamesMenuItem />
              </FlexItemWrapper>

              <FlexItemWrapper>
                <LoggedUser></LoggedUser>
              </FlexItemWrapper>
              {/* Login Button (Desktop) */}
              <LoginIconWrapper
                data-tooltip={isAuthenticated ? 'Выйти' : 'Войти'}
                onClick={() => {
                  isAuthenticated ? handleLogout() : openLoginModal();
                }}
              >
                {isAuthenticated ? <LuLogOut /> : <LuLogIn />}
              </LoginIconWrapper>
            </FlexWrapper>
          </RightContainer>
        </HeaderContainer>
      )}
      {/* NEW MOBILE MENU */}
      {isMobile && (
        <>
          {!menuOpen && (
            <>
              <MobileHeaderContainer>
                <LogoWrapper>
                  <Link href="/">
                    <Logo />
                  </Link>
                </LogoWrapper>
                <MobileBurgerWrapper onClick={() => setMenuOpen(!menuOpen)}>
                  <BurgerIcon />
                </MobileBurgerWrapper>
              </MobileHeaderContainer>
              {/* Breadcrumbs Below Sticky Header */}
              <MobileBreadcrumbContainer>
                <Breadcrumbs />
                {pathname === '/' && filters.onlyMyDevelopedGames && (
                  <span style={{ fontSize: '16px', color: 'rgb(var(--foreground))' }}>
                    &gt; Мои игры
                  </span>
                )}
              </MobileBreadcrumbContainer>
            </>
          )}

          {/* MOBILE OFF-CANVAS MENU */}
          <MobileOffCanvasMenu $isOpen={menuOpen}>
            <MobileOffCanvasMenuHeader>
              <LogoWrapper>
                <Logo />
              </LogoWrapper>
              <MobileBurgerWrapper onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </MobileBurgerWrapper>
            </MobileOffCanvasMenuHeader>
            {isAuthenticated && (
              <div
                style={{
                  display: 'flex',
                  padding: '1rem 0.25rem',
                  marginTop: '1rem',
                  borderBottom: '1px solid rgba(var(--theme-grey), 0.2)',
                  marginBottom: '1rem',
                  color: 'rgb(var(--theme-yellow))',
                  fontWeight: '500',
                }}
              >
                Пользователь:&nbsp;{' '}
                <LoggedUser
                  onClick={() => {
                    setMenuOpen(false);
                    openProfileModal();
                  }}
                />
              </div>
            )}
            <MobileOffCanavasMenuContainer>
              <StyledNextLink href="/about-platform" onClick={() => setMenuOpen(false)}>
                О платформе
              </StyledNextLink>
              <StyledNextLink href="/support" onClick={() => setMenuOpen(false)}>
                Поддержка
              </StyledNextLink>
              {isAuthenticated && purchasedGames.length > 0 && (
                <StyledNextLink href="/games/my" onClick={() => setMenuOpen(false)}>
                  Мои покупки
                </StyledNextLink>
              )}

              <MyGamesMenuItemWrapper onClick={() => setMenuOpen(false)}>
                <MyGamesMenuItem />
              </MyGamesMenuItemWrapper>
              {/* Mobile Login Button */}
              {isAuthenticated ? (
                <>
                  <LoginButton
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <LuLogOut size={20} /> Выход
                  </LoginButton>
                </>
              ) : (
                <>
                  {console.log('Render: login button')}
                  <LoginButton onClick={openLoginModal}>
                    <LuLogIn size={20} /> Вход
                  </LoginButton>
                </>
              )}
            </MobileOffCanavasMenuContainer>
          </MobileOffCanvasMenu>
        </>
      )}
      {isAuthenticated && <UserProfileModal />}

      {/* LOGIN MODAL (visible for both desktop and mobile) - removing to Root layout
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      */}
    </>
  );
};

export default Header;
