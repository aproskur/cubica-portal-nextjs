'use client';

import Link from 'next/link';
import styled from 'styled-components';

const StyledNextLink = styled(Link)`
  display: block;
  font-size: 18px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid transparent;
  color: rgb(var(--foreground));
  text-decoration: none;
  transition:
    background 0.3s ease-in-out,
    border 0.3s ease-in-out;

  &:hover {
    background: #333;
    border-color: rgb(var(--theme-yellow));
  }
`;

export default StyledNextLink;
