"use client";
import { useState } from "react";
import styled from "styled-components";
import RichTextBlockRenderer from './RichTextBlockRenderer';
import QuillEditor from "./QuillEditor";
import { useAuth } from "@/context/AuthContext";
import { handleGameUpdate } from "@/utils/apiService";
import { normalizeSlateForStrapi } from "@/utils/strapiSlateTransformers";
import { saveAndUpdateGame } from "@/utils/gameHelpers";

//import { htmlToSlate } from 'slate-serializers';
//import { htmlToSlate } from "@slate-serializers/html";
import { customHtmlToSlateConfig } from "@/utils/slateHtmlConfig";
import { slateToHtml, htmlToSlate } from "@/utils/strapiSlateTransformers";
//import { customSlateToHtmlConfig } from "@/utils/slateHtmlConfig";


//console.log("customSlateToHtmlConfig:", customSlateToHtmlConfig);

//console.log("CONFIG:", customSlateToHtmlConfig);
//console.log("CONFIG.elementMap:", customSlateToHtmlConfig?.elementMap);
//console.log("CONFIG.paragraph type:", customSlateToHtmlConfig?.elementMap?.paragraph);



const DesktopOnly = styled.div`
  display: none;

  @media (min-width: 875px) {
    display: block;
  }
`;

const MobileOnly = styled.div`
  @media (min-width: 875px) {
    display: none;
  }
`;


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
  console.log("Tabs got a game purpose", game.purpose);
  const [activeTab, setActiveTab] = useState(0); // 1st tab opened initially
  const { user } = useAuth();
  const isDeveloper = user?.id === game?.developed_by?.id;
    // local copies of the  text fields

    const [aboutAuthorText, setAboutAuthorText] = useState(game.about_author || "");
    const [supportText,     setSupportText]     = useState(game.game_support|| "");


  console.log("game support", game.game_support)
  console.log("game author", game.about_author)
  console.log("game itself", game);

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

  console.log("GamePurpose", game.purpose);
  console.log("GAME Purpose:", JSON.stringify(game.purpose, null, 2));
  return (
    <TabContainer>
      {/* Desktop layout only */}
      <DesktopOnly>
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
                initialValue={slateToHtml(game.purpose)}
                onSave={async (htmlString) => {
                  try {
                    const token = localStorage.getItem("jwt");
                    if (!token) {
                      alert("Пользователь не авторизован");
                      return;
                    }
                    console.log("html string", JSON.stringify(htmlString));
                    const slateLike = htmlToSlate(htmlString);
                    console.log("Slate-like:", JSON.stringify(slateLike, null, 2));
                    const normalized = normalizeSlateForStrapi(slateLike);
                    console.log("Normalized:", JSON.stringify(normalized, null, 2));

                    await handleGameUpdate(game.documentId, {
                      game_purpose: normalized,
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
                initialValue={slateToHtml(game.plot)}
                onSave={async (htmlString) => {
                  try {
                    const token = localStorage.getItem("jwt");
                    if (!token) {
                      alert("Пользователь не авторизован");
                      return;
                    }

                    // Step 1: Convert HTML back to Slate-style JSON
                    console.log("HTML", htmlString)
                    const slateLike = htmlToSlate(htmlString);
                    console.log("SLATE FROM HTML:", JSON.stringify(slateLike, null, 2));

                    // Step 2: Normalize it to match Strapi Blocks schema
                    const normalized = normalizeSlateForStrapi(slateLike);

                    // Step 3: Save to Strapi
                    await handleGameUpdate(game.documentId, {
                      game_plot: normalized,
                    }, token);

                    alert("Сюжет успешно сохранён");
                  } catch (error) {
                    console.error("Ошибка при сохранении сюжета:", error);
                    alert("Не удалось сохранить сюжет");
                  }
                }}

              />

            ) : (
              <RichTextBlockRenderer blocks={game.plot} />
            ))}
          {activeTab === 2 && game.reviews}
          {activeTab === 3 &&
            (isDeveloper ? (
              <textarea
                defaultValue={aboutAuthorText}
                onChange={e => setAboutAuthorText(e.target.value)}
                onBlur={async () => {
                       try {
                       const token = localStorage.getItem("jwt");
                        if (!token) throw new Error("Пользователь не авторизован");
                  
                       await handleGameUpdate(
                           game.documentId,
                          { about_author: aboutAuthorText },
                           token
                        );
                  

                        alert("Об авторе успешно обновлено");
                      } catch (err) {
                       console.error(err);
                        alert("Не удалось сохранить Об авторе");
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
              <div dangerouslySetInnerHTML={{ __html: game.about_author }} />
            ))}


          {activeTab === 4 &&
            (isDeveloper ? (
              <textarea
              defaultValue={supportText}
              onChange={e => setSupportText(e.target.value)}
              onBlur={async () => {
                     try {
                     const token = localStorage.getItem("jwt");
                      if (!token) throw new Error("Пользователь не авторизован");
                
                     await handleGameUpdate(
                         game.documentId,
                        { game_support: supportText },
                         token
                      );
                

                      alert("support успешно обновлено");
                    } catch (err) {
                     console.error(err);
                      alert("Не удалось сохранить support");
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

      </DesktopOnly>

      {/* Mobile stacked layout */}
      <MobileOnly>
        {tabs.map((tab, index) => (
          <div key={index}>
            <TabHeader
              $active={activeTab === index}
              onClick={() => setActiveTab(index === activeTab ? null : index)}
            >
              {tab.label}
            </TabHeader>
            {activeTab === index && (
              <TabContent>
                {tab.content}
              </TabContent>
            )}
          </div>
        ))}
      </MobileOnly>
    </TabContainer>

  );
};

export default Tabs;