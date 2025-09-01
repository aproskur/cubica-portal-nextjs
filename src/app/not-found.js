// app/not-found.js
'use client';
import styled from 'styled-components';
import Image from 'next/image';
import { Roboto } from 'next/font/google';
import { useRouter } from 'next/navigation';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '800'],
  display: 'swap',
});

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  text-align: center;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  font-weight: 700;
  color: rgb(var(--theme-yellow));
  font-size: clamp(115px, 10vw, 196px);
  line-height: 0.7;
  @media (max-width: 768px) {
    padding-top: 16px;
  }
`;

const Subtitle = styled.h2`
  margin: 0;
  font-weight: 700;
  max-width: 28ch;
  text-wrap: balance;
  font-size: clamp(24px, 2.2vw, 34px);
  color: rgba(255, 255, 255, 0.7);
`;

const Message = styled.p`
  margin: 0;
  max-width: 36ch; /* keeps to two lines on desktop and most mobiles */
  text-wrap: balance;
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(18px, 1.8vw, 22px);
  font-weight: 500;
`;

const CubeImageWrapper = styled.div`
  width: clamp(150px, 22vw, 225px);
  img {
    width: 100%;
    height: auto;
    display: block;
    height: auto;
    object-fit: contain;
    object-position: center;
  }
`;

const HomeButton = styled.button`
  background-color: rgba(var(--theme-grey), 0.2);
  border: none;
  color: rgb(var(--theme-yellow));
  padding: 20px 60px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: clamp(18px, 1.8vw, 22px);
  font-weight: 500;

  &:hover {
    background-color: rgba(var(--theme-grey), 0.1);
    color: rgb(var(--foreground));
  }
`;

export default function NotFound() {
  const router = useRouter();

  return (
    <Wrapper className={roboto.className}>
      <Title>404</Title>
      <Subtitle>Страница не найдена</Subtitle>
      <CubeImageWrapper>
        <Image
          src="/assets/images/cube-trimmed.png"
          alt="404 Кубик"
          width={250}
          height={250}
          priority
        />
      </CubeImageWrapper>
      <Message>Запрошенная вами страница удалена или не существует</Message>
      <HomeButton onClick={() => router.push('/')}>На главную</HomeButton>
    </Wrapper>
  );
}
