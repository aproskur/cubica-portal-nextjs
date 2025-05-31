"use client";
import { useState } from "react";
import styled from "styled-components";
import RichTextBlockRenderer from './RichTextBlockRenderer';
import QuillEditor from "./QuillEditor";
import { useAuth } from "@/context/AuthContext";
import { handleGameUpdate } from "@/utils/apiService";
import { saveAndUpdateGame } from "@/utils/gameHelpers";
import { htmlToSlateConfig } from "@/utils/htmlToSlateConfig";
import { slateToHtmlConfig } from "@/utils/slateToHtmlConfig";
import { htmlToSlate, slateToHtml } from "@slate-serializers/html";
import {
  cleanQuillHtml,
  normalizeSlateForStrapi,
  ensureTextNodesHaveType
} from '@/utils/slateTransformHelpers';
import { useIsMobile } from "@/app/hooks/useIsMobile";



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
  background-color: ${(props) => (props.$active ? "#262626" : "transparent")};
  color: ${(props) => (props.$active ? "rgb(var(--theme-yellow))" : "#aaa")};
  border: none;
  border-bottom: ${(props) =>
    props.$active
      ? "2px solid rgb(var(--theme-yellow))"
      : "2px solid transparent"};
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

const Tabs = ({ game }) => {
  const { user } = useAuth();
  const isDeveloper = user?.id === game?.developed_by?.id;
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileTabs game={game} isDeveloper={isDeveloper} />
  ) : (
    <DesktopTabs game={game} isDeveloper={isDeveloper} />
  );
};



const DesktopTabs = ({isDeveloper, game}) => {
    const [supportText,setSupportText] = useState(game.game_support|| "");
    const [originalSupportText, setOriginalSupportText] = useState(game.game_support || "");
    const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Для чего и кого" },
    { label: "Сюжет игры" },
    { label: "Отзывы" },
    { label: "Об авторе" },
    { label: "Поддержка" },
  ];

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  

  return (
    <TabContainer>
        <TabHeaders>
          {tabs.map((tab, index) => (
            <TabHeader
              key={index}
              $active={activeTab === index}
              onClick={() => setActiveTab(index)}
            >
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
                    const token = localStorage.getItem("jwt");
                    if (!token) {
                      alert("Пользователь не авторизован");
                      return;
                    }
                    const fixedHtml = cleanQuillHtml(htmlString);
                    const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
     //const normalizeForStrapi = normalizeSlateForStrapi(slate);
     const sendToStrapi = ensureTextNodesHaveType(slate);
                    await handleGameUpdate(game.documentId, {
                      game_purpose: sendToStrapi,
                    }, token);

                    alert("Цель игры успешно сохранена");
                  } catch (error) {
                    console.error("Ошибка при сохранении цели:", error);
                    alert("Не удалось сохранить цель");
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
                    const token = localStorage.getItem("jwt");
                    if (!token) {
                      alert("Пользователь не авторизован");
                      return;
                    }
                    const fixedHtml = cleanQuillHtml(htmlString);
                    const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
     //const normalizeForStrapi = normalizeSlateForStrapi(slate);
     const sendToStrapi = ensureTextNodesHaveType(slate);
                    await handleGameUpdate(game.documentId, {
                      game_plot: sendToStrapi,
                    }, token);

                    alert("Сюжет игры успешно сохранён");
                  } catch (error) {
                    console.error("Ошибка при сохранении сюжета:", error);
                    alert("Не удалось сохранить сюжет");
                  }
                }}
              />
            ): (
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
                    const token = localStorage.getItem("jwt");
                    if (!token) {
                      alert("Пользователь не авторизован");
                      return;
                    }
                    const fixedHtml = cleanQuillHtml(htmlString);
                    const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
     //const normalizeForStrapi = normalizeSlateForStrapi(slate);
     const sendToStrapi = ensureTextNodesHaveType(slate);
                    await handleGameUpdate(game.documentId, {
                      about_author: sendToStrapi,
                    }, token);

                    alert("Информация об авторе игры успешно сохранена");
                  } catch (error) {
                    console.error("Ошибка при сохранении об авторе:", error);
                    alert("Не удалось сохранить информацию об авторе");
                  }
                }}
              />
            ): (
              <RichTextBlockRenderer blocks={game.about_author} />
            ))}


          {activeTab === 4 &&
            (isDeveloper ? (
              <textarea
              defaultValue={supportText}
              onChange={e => setSupportText(e.target.value)}
       onBlur={async () => {
  if (supportText.trim() === originalSupportText.trim()) return;

  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Пользователь не авторизован");

    await handleGameUpdate(game.documentId, { game_support: supportText }, token);
    setOriginalSupportText(supportText); // sync state after successful save
    alert("successful support update");
  } catch (err) {
    console.error(err);
    alert("not successful");
  }
}}

                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.target.blur();
                  }
                }}
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "10px",
                  fontSize: "14px",
                  backgroundColor: "#1c1c1c",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "5px",
                  resize: "vertical",
                }}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: game.game_support }} />
            ))}

      </TabContent>
    </TabContainer>
  );
};


const MobileTabs = ({ game, isDeveloper }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [supportText, setSupportText] = useState(game.game_support || "");
  const [originalSupportText, setOriginalSupportText] = useState(game.game_support || "");

  const tabs = [
    { label: "Для чего и кого" },
    { label: "Сюжет игры" },
    { label: "Отзывы" },
    { label: "Об авторе" },
    { label: "Поддержка" },
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
                      const token = localStorage.getItem("jwt");
                      if (!token) return alert("Пользователь не авторизован");
                      const fixedHtml = cleanQuillHtml(htmlString);
                      const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                      const sendToStrapi = ensureTextNodesHaveType(slate);
                      await handleGameUpdate(game.documentId, { game_purpose: sendToStrapi }, token);
                      alert("Цель обновлена");
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
                      const token = localStorage.getItem("jwt");
                      if (!token) return alert("Пользователь не авторизован");
                      const fixedHtml = cleanQuillHtml(htmlString);
                      const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                      const sendToStrapi = ensureTextNodesHaveType(slate);
                      await handleGameUpdate(game.documentId, { game_plot: sendToStrapi }, token);
                      alert("Сюжет обновлён");
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
                      const token = localStorage.getItem("jwt");
                      if (!token) return alert("Пользователь не авторизован");
                      const fixedHtml = cleanQuillHtml(htmlString);
                      const slate = htmlToSlate(fixedHtml, htmlToSlateConfig);
                      const sendToStrapi = ensureTextNodesHaveType(slate);
                      await handleGameUpdate(game.documentId, { about_author: sendToStrapi }, token);
                      alert("Об авторе обновлено");
                    }}
                  />
                ) : (
                  <RichTextBlockRenderer blocks={game.about_author} />
                ))}

              {index === 4 &&
                (isDeveloper ? (
                  <textarea
                    value={supportText}
                    onChange={(e) => setSupportText(e.target.value)}
                    onBlur={async () => {
                      if (supportText.trim() === originalSupportText.trim()) return;
                      const token = localStorage.getItem("jwt");
                      if (!token) return alert("Пользователь не авторизован");
                      await handleGameUpdate(game.documentId, { game_support: supportText }, token);
                      setOriginalSupportText(supportText);
                      alert("Поддержка обновлена");
                    }}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "10px",
                      fontSize: "14px",
                      backgroundColor: "#1c1c1c",
                      color: "#fff",
                      border: "1px solid #444",
                      borderRadius: "5px",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: game.game_support }} />
                ))}
            </TabContent>
          )}
        </div>
      ))}
    </TabContainer>
  );
};


export default Tabs