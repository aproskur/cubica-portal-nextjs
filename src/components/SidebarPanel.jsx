/* I added this for developer contacts on mobile. But it might be reusable  */
'use client';
import React from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

const PanelWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')}; /* use $ prefix */
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: rgb(var(--background));
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 1500;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease-in-out;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: rgb(var(--theme-yellow));
  align-self: flex-end;
  cursor: pointer;
`;

const Title = styled.h2`
  margin: 1rem 0;
  font-size: 20px;
  color: rgb(var(--theme-yellow));
`;

const SidebarPanel = ({ isOpen, onClose, title, children }) => {
  return (
    <PanelWrapper $isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <FiX />
      </CloseButton>
      {title && <Title>{title}</Title>}
      {children}
    </PanelWrapper>
  );
};

export default SidebarPanel;
