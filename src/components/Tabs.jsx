'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import RichTextBlockRenderer from './RichTextBlockRenderer';
import QuillEditor from './QuillEditor';
import { useAuth } from '@/context/AuthContext';
import { handleGameUpdate } from '@/utils/apiService';
import { saveAndUpdateGame } from '@/utils/gameHelpers';
import { htmlToSlateConfig } from '@/utils/htmlToSlateConfig';
import { slateToHtmlConfig } from '@/utils/slateToHtmlConfig';
import { htmlToSlate, slateToHtml } from '@slate-serializers/html';
import {
  cleanQuillHtml,
  normalizeSlateForStrapi,
  ensureTextNodesHaveType,
} from '@/utils/slateTransformHelpers';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import FAQitem from './ui/FAQitem';
import { useGamesData } from '@/context/GamesDataContext';
import { CiCirclePlus } from 'react-icons/ci';
import { nanoid } from 'nanoid';
import FAQeditor from './FAQeditor';

const TabContainer = styled.div`
  display: flex;
  flex-direction: column; // always column
  border-radius: 8px;
  background-color: inherit;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

const TabHeaders = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid #333;

  @media (min-width: 875px) {
    flex-direction: row;
    border-bottom: 1px solid #333;
  }
`;

const TabHeader = styled.button`
  flex: 1 1 200px;
  min-width: 120px;
  max-width: 300px;
  padding: 14px 20px;
  text-transform: uppercase;
  background-color: ${(props) => (props.$active ? '#262626' : 'transparent')};
  color: ${(props) => (props.$active ? 'rgb(var(--theme-yellow))' : '#aaa')};
  border: none;
  border-bottom: ${(props) =>
    props.$active ? '2px solid rgb(var(--theme-yellow))' : '2px solid transparent'};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    color: rgb(var(--theme-yellow));
    background-color: #1c1c1c;
  }
  @media (min-width: 875px) {
    flex: 1 1 200px;
    min-width: 120px;
    max-width: 300px;
    text-align: center;
  }
  }
`;

const TabContent = styled.div`
  width: 100%;
  padding: 20px;
  color: #fff;
  font-size: 0.85rem;
  line-height: 1.5;
  background-color: #1c1c1c;

  h3 {
    font-size: 0.95rem;
    margin-top: 1rem;
  }
`;

const Tabs = () => {
  const isMobile = useIsMobile();
  const { currentGame: game, setCurrentGame } = useGamesData();

  const { user } = useAuth();
  if (!game) return null;
  const isDeveloper = user?.id === game?.developed_by?.id;

  return isMobile ? (
    <MobileTabs isDeveloper={isDeveloper} />
  ) : (
    <DesktopTabs isDeveloper={isDeveloper} />
  );
};

const DesktopTabs = ({ isDeveloper }) => {
  const { currentGame: game, setCurrentGame } = useGamesData();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {}, [game]);
  const [editedFaqs, setEditedFaqs] = useState(() =>
    (game.faqs || []).map((faq) => ({
      documentId: faq.documentId || faq.id || null, // fallback to id if needed
      question: faq.question,
      answer: faq.answer,
    }))
  );

  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const tabs = [
    { label: 'Для чего и кого' },
    { label: 'Сюжет игры' },
    { label: 'Отзывы' },
    { label: 'Об авторе' },
    { label: 'Частые вопросы' },
  ];

  return (
    <TabContainer>
      <TabHeaders>
        {tabs.map((tab, index) => (
          <TabHeader key={index} $active={activeTab === index} onClick={() => setActiveTab(index)}>
            {tab.label}
          </TabHeader>
        ))}
      </TabHeaders>
      <TabContent>
        {activeTab === 0 &&
          (isDeveloper ? (
            <QuillEditor
              key={`quill-tab-${activeTab}`}
              initialValue={slateToHtml(game.purpose, slateToHtmlConfig)}
              onSave={async (htmlString) => {
                try {
                  const token = localStorage.getItem('jwt');
                  if (!token) {
                    alert('Пользователь не авторизован');
                    return;
                  }
                  const fixedHtml = cleanQuillHtml(htmlString);
                  const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                  //const normalizeForStrapi = normalizeSlateForStrapi(slate);
                  const sendToStrapi = ensureTextNodesHaveType(slate);
                  await handleGameUpdate(
                    game.documentId,
                    {
                      game_purpose: sendToStrapi,
                    },
                    token
                  );
                  setCurrentGame({ ...game, purpose: sendToStrapi });

                  alert('Цель игры успешно сохранена');
                } catch (error) {
                  console.error('Ошибка при сохранении цели:', error);
                  alert('Не удалось сохранить цель');
                }
              }}
            />
          ) : (
            <RichTextBlockRenderer blocks={game.purpose} />
          ))}
        {activeTab === 1 &&
          (isDeveloper ? (
            <QuillEditor
              key={`quill-tab-${activeTab}`}
              initialValue={slateToHtml(game.plot, slateToHtmlConfig)}
              onSave={async (htmlString) => {
                try {
                  const token = localStorage.getItem('jwt');
                  if (!token) {
                    alert('Пользователь не авторизован');
                    return;
                  }
                  const fixedHtml = cleanQuillHtml(htmlString);
                  const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                  //const normalizeForStrapi = normalizeSlateForStrapi(slate);
                  const sendToStrapi = ensureTextNodesHaveType(slate);
                  await handleGameUpdate(
                    game.documentId,
                    {
                      game_plot: sendToStrapi,
                    },
                    token
                  );
                  setCurrentGame({ ...game, plot: sendToStrapi });
                  alert('Сюжет игры успешно сохранён');
                } catch (error) {
                  console.error('Ошибка при сохранении сюжета:', error);
                  alert('Не удалось сохранить сюжет');
                }
              }}
            />
          ) : (
            <RichTextBlockRenderer blocks={game.plot} />
          ))}
        {activeTab === 2 && game.reviews}
        {activeTab === 3 &&
          (isDeveloper ? (
            <QuillEditor
              key={`quill-tab-${activeTab}`}
              initialValue={slateToHtml(game.about_author, slateToHtmlConfig)}
              onSave={async (htmlString) => {
                try {
                  const token = localStorage.getItem('jwt');
                  if (!token) {
                    alert('Пользователь не авторизован');
                    return;
                  }
                  const fixedHtml = cleanQuillHtml(htmlString);
                  const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                  //const normalizeForStrapi = normalizeSlateForStrapi(slate);
                  const sendToStrapi = ensureTextNodesHaveType(slate);
                  await handleGameUpdate(
                    game.documentId,
                    {
                      about_author: sendToStrapi,
                    },
                    token
                  );
                  setCurrentGame({ ...game, about_author: sendToStrapi });
                  alert('Информация об авторе игры успешно сохранена');
                } catch (error) {
                  console.error('Ошибка при сохранении об авторе:', error);
                  alert('Не удалось сохранить информацию об авторе');
                }
              }}
            />
          ) : (
            <RichTextBlockRenderer blocks={game.about_author} />
          ))}
        {activeTab === 4 && (
          <div>
            {isDeveloper ? (
              <FAQeditor
                initialFaqs={editedFaqs}
                gameId={game.id}
                token={localStorage.getItem('jwt')}
                onSave={(updatedFaqs) => {
                  setEditedFaqs(updatedFaqs);
                  setCurrentGame({ ...game, faqs: updatedFaqs });
                }}
              />
            ) : (
              editedFaqs.map((faq, index) => (
                <FAQitem
                  key={faq.id || faq._tempKey || `faq-${index}`}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))
            )}
          </div>
        )}
      </TabContent>
    </TabContainer>
  );
};

const MobileTabs = ({ isDeveloper }) => {
  const { currentGame: game, setCurrentGame } = useGamesData();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {}, [game]);

  const [editedFaqs, setEditedFaqs] = useState(() =>
    (game.faqs || []).map((faq) => ({
      documentId: faq.documentId || faq.id || null, // fallback to id if needed
      question: faq.question,
      answer: faq.answer,
    }))
  );

  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const tabs = [
    { label: 'Для чего и кого' },
    { label: 'Сюжет игры' },
    { label: 'Отзывы' },
    { label: 'Об авторе' },
    { label: 'Частые вопросы' },
  ];

  return (
    <TabContainer>
      {tabs.map((tab, index) => (
        <div key={index}>
          <TabHeader
            $active={activeTab === index}
            onClick={() => setActiveTab(activeTab === index ? null : index)}
          >
            {tab.label}
          </TabHeader>
          {activeTab === index && (
            <TabContent>
              {index === 0 &&
                (isDeveloper ? (
                  <QuillEditor
                    initialValue={slateToHtml(game.purpose, slateToHtmlConfig)}
                    onSave={async (htmlString) => {
                      const token = localStorage.getItem('jwt');
                      if (!token) return alert('Пользователь не авторизован');
                      const fixedHtml = cleanQuillHtml(htmlString);
                      const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                      const sendToStrapi = ensureTextNodesHaveType(slate);
                      await handleGameUpdate(game.documentId, { game_purpose: sendToStrapi }, token);
                      setCurrentGame({ ...game, purpose: sendToStrapi });
                      alert('Цель обновлена');
                    }}
                  />
                ) : (
                  <RichTextBlockRenderer blocks={game.purpose} />
                ))}

              {index === 1 &&
                (isDeveloper ? (
                  <QuillEditor
                    initialValue={slateToHtml(game.plot, slateToHtmlConfig)}
                    onSave={async (htmlString) => {
                      const token = localStorage.getItem('jwt');
                      if (!token) return alert('Пользователь не авторизован');
                      const fixedHtml = cleanQuillHtml(htmlString);
                      const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                      const sendToStrapi = ensureTextNodesHaveType(slate);
                      await handleGameUpdate(game.documentId, { game_plot: sendToStrapi }, token);
                      setCurrentGame({ ...game, plot: sendToStrapi });
                      alert('Сюжет обновлён');
                    }}
                  />
                ) : (
                  <RichTextBlockRenderer blocks={game.plot} />
                ))}

              {index === 2 && game.reviews}

              {index === 3 &&
                (isDeveloper ? (
                  <QuillEditor
                    initialValue={slateToHtml(game.about_author, slateToHtmlConfig)}
                    onSave={async (htmlString) => {
                      const token = localStorage.getItem('jwt');
                      if (!token) return alert('Пользователь не авторизован');
                      const fixedHtml = cleanQuillHtml(htmlString);
                      const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                      const sendToStrapi = ensureTextNodesHaveType(slate);
                      await handleGameUpdate(game.documentId, { about_author: sendToStrapi }, token);
                      setCurrentGame({ ...game, about_author: sendToStrapi });
                      alert('Об авторе обновлено');
                    }}
                  />
                ) : (
                  <RichTextBlockRenderer blocks={game.about_author} />
                ))}

              {activeTab === 4 && (
                <div>
                  {isDeveloper ? (
                    <FAQeditor
                      initialFaqs={editedFaqs}
                      gameId={game.id}
                      token={localStorage.getItem('jwt')}
                      onSave={(updatedFaqs) => {
                        setEditedFaqs(updatedFaqs);
                        setCurrentGame({ ...game, faqs: updatedFaqs });
                      }}
                    />
                  ) : (
                    editedFaqs.map((faq, index) => (
                      <FAQitem
                        key={faq.id || faq._tempKey || `faq-${index}`}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))
                  )}
                </div>
              )}
            </TabContent>
          )}
        </div>
      ))}
    </TabContainer>
  );
};

export default Tabs;
