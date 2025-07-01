//app/not-found.js

'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/*
const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  padding: 2rem;
  text-align: center;
`; */

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  padding: 2rem;
  text-align: center;
  overflow: hidden;

  @media (max-width: 768px) {
    padding-top: 200px;
    justify-content: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: rgb(var(--theme-yellow));
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    font-size: 4rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: rgb(var(--theme-grey));
  margin-top: 2rem;
`;

const CubeImageWrapper = styled.div`
  max-width: 250px;
  width: 100%;
  height: auto;
  margin: 1.5rem 0;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 960px) {
    max-width: 125px;
  }
`;
/*
const CubeImage = styled(Image)`
  max-width: 250px;
  width: 100%;
  height: auto;
  margin: 1.5rem 0;
`; */

const HomeButton = styled.button`
  margin-top: 2rem;
  background-color: rgba(var(--theme-grey), 0.2);
  border: none;
  color: rgb(var(--theme-yellow));
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(var(--theme-yellow), 0.1);
    color: rgb(var(--foreground));
  }
`;

export default function NotFound() {
  const router = useRouter();

  return (
    <Wrapper>
      <Title>404</Title>
      <Subtitle>Страница не найдена</Subtitle>

      <CubeImageWrapper>
        <Image
          src="/assets/images/cubica404transp.png"
          alt="404 Кубик"
          width={250}
          height={250}
          priority
        />
      </CubeImageWrapper>

      <Message>Запрошенная Вами страница удалена или не существует</Message>

      <HomeButton onClick={() => router.push('/')}>На главную</HomeButton>
    </Wrapper>
  );
}
