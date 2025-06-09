'use client';
import { useState } from 'react';
import styled from 'styled-components';
import { CiCirclePlus } from 'react-icons/ci';
import { nanoid } from 'nanoid';

const QuestionInput = styled.input`
  width: 50px;
  padding: 8px;
  font-size: 14px;
  font-family: inherit;
  background-color: rgb(var(--background));
  color: rgb(var(--theme-yellow));
  border: 1px solid rgba(var(--theme-grey), 0.5);
  border-radius: 4px;
  text-align: left;
  appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }
  &:focus {
    border-color: rgb(var(--theme-yellow));
    box-shadow: 0 0 5px rgba(var(--theme-yellow), 0.5);
  }
`;

const AnswerTextArea = styled.textarea`
  width: 50px;
  padding: 8px;
  font-size: 14px;
  font-family: inherit;
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  border: 1px solid rgba(var(--theme-grey), 0.5);
  border-radius: 4px;
  text-align: left;
  &:focus {
    border-color: rgb(var(--theme-yellow));
    box-shadow: 0 0 5px rgba(var(--theme-yellow), 0.5);
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const StyledButton = styled.button`
  background: inherit;
  border: 1px solid rgb(var(--theme-grey));
  color: rgb(var(--foreground));
  font-family: var(--font-montserrat), Arial, Helvetica, sans-serif;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: auto;
  min-width: 150px;
  &:hover {
    border: 1px solid rgb(var(--theme-yellow));
    color: #fff;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FaqEditForm = styled.div`
  padding: 1.5rem 0;
`;

const FAQeditor = ({ initialFaqs, gameId, token, onSave }) => {
  const [editedFaqs, setEditedFaqs] = useState(initialFaqs || []);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [showNewFaqForm, setShowNewFaqForm] = useState(false);

  console.log('Initial FAQ data:', initialFaqs);

  const handleFaqChange = (index, field, value) => {
    const updated = [...editedFaqs];
    updated[index] = {
      ...updated[index],
      [field]: value,
      wasEdited: true,
    };
    setEditedFaqs(updated);
  };

  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) return;

    const alreadyExists = editedFaqs.some(
      (f) =>
        f.question.trim() === newFaq.question.trim() &&
        f.answer.trim() === newFaq.answer.trim() &&
        !f.documentId
    );

    if (alreadyExists) return;

    const newEntry = {
      ...newFaq,
      documentId: null,
      wasEdited: false,
      _tempKey: nanoid(),
    };

    setEditedFaqs((prev) => [...prev, newEntry]);
    setNewFaq({ question: '', answer: '' });
    setShowNewFaqForm(false);
  };

  const handleSaveFaqs = async () => {
    if (!token) return alert('Не авторизован');

    const savedFaqs = await Promise.all(
      editedFaqs.map(async (faq) => {
        const isValid = faq.question?.trim() && faq.answer?.trim();
        if (!isValid) return null;

        if (!faq.documentId) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/faqs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                question: faq.question,
                answer: faq.answer,
                game: gameId,
              },
            }),
          });

          const json = await res.json();
          const created = json?.data;
          if (!created?.documentId) {
            console.error('Missing documentId in response:', json);
            return null;
          }

          return {
            question: created.question,
            answer: created.answer,
            documentId: created.documentId,
            wasEdited: false,
          };
        }

        if (faq.wasEdited) {
          await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/faqs/${faq.documentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                question: faq.question,
                answer: faq.answer,
              },
            }),
          });

          return { ...faq, wasEdited: false };
        }

        return faq;
      })
    );

    const filtered = savedFaqs.filter(Boolean);
    setEditedFaqs(filtered);
    alert('FAQ обновлены');
    if (onSave) onSave(filtered);
  };

  return (
    <>
      <FlexWrapper>
        <CiCirclePlus
          onClick={() => setShowNewFaqForm(!showNewFaqForm)}
          size={50}
          color="rgb(var(--theme-yellow))"
          style={{ cursor: 'pointer' }}
        />
        <h4>Добавить новый вопрос</h4>
      </FlexWrapper>

      {showNewFaqForm && (
        <FaqEditForm>
          <QuestionInput
            type="text"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            placeholder="Введите вопрос"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <AnswerTextArea
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            placeholder="Введите ответ"
            style={{ width: '100%' }}
          />
          <StyledButton onClick={handleAddFaq} style={{ marginTop: '0.75rem' }}>
            Добавить в список
          </StyledButton>
        </FaqEditForm>
      )}

      {editedFaqs.map((faq, index) => (
        <div
          key={faq.documentId || faq._tempKey || `faq-${index}`}
          style={{ marginBottom: '1rem' }}
        >
          <QuestionInput
            type="text"
            value={faq.question}
            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
            placeholder="Вопрос"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <AnswerTextArea
            value={faq.answer}
            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
            placeholder="Ответ"
            style={{ width: '100%' }}
          />
        </div>
      ))}

      <StyledButton onClick={handleSaveFaqs} style={{ marginTop: '2rem' }}>
        Сохранить все изменения
      </StyledButton>
    </>
  );
};

export default FAQeditor;
