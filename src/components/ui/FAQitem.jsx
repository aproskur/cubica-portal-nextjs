import { useState } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AccordionWrapper = styled.div`
  border-bottom: 1px solid rgb(var(--theme-yellow));
  margin-bottom: 1rem;
`;

const QuestionButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  color: rgb(var(--foreground));
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  padding: 1rem 0;
`;

const AnswerWrapper = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  color: rgb(var(--foreground));
`;

const AnswerContent = styled.div`
  padding: ${({ $isOpen }) => ($isOpen ? '0.5rem 0' : '0')};
  transition: padding 0.3s ease;
`;

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionWrapper>
      <QuestionButton onClick={() => setIsOpen((prev) => !prev)}>
        {question}
        {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </QuestionButton>
      <AnswerWrapper $isOpen={isOpen}>
        <AnswerContent $isOpen={isOpen}>{answer}</AnswerContent>
      </AnswerWrapper>
    </AccordionWrapper>
  );
};

export default FAQItem;
