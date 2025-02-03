"use client";
import { useState } from "react";
import styled from "styled-components";

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: inherit;
  border-radius: 8px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); 
  min-height: 150px;
  
`;

const TabHeaders = styled.div`
  display: flex;
  border-bottom: 2px solid #333;
`;

const TabHeader = styled.button`
  flex: 1;
  padding: 14px 20px;
  text-transform: uppercase;
  color: ${(props) => (props.$active ? "rgb(var(--theme-yellow))" : "#aaa")};
  background-color: ${(props) => (props.$active ? "#262626" : "transparent")};
  border: none;
  border-bottom: ${(props) => (props.$active ? "2px solid rgb(var(--theme-yellow))" : "none")};
  cursor: pointer;
  font-size: 16px; /* Keep font size consistent */
  font-weight: bold; /* Apply consistent weight */
  text-align: center;
  line-height: 1; /* Ensure consistent line height */
  transition: color 0.3s, background-color 0.3s, box-shadow 0.3s ease;
  box-shadow: ${(props) =>
    props.$active ? "0px 2px 4px rgba(0, 0, 0, 0.3)" : "none"}; /* Add shadow to active tab */

  &:hover {
    color: rgb(var(--theme-yellow));
    background-color: #1c1c1c;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Add hover shadow effect */
  }

  &:focus {
    outline: none;
  }
`;


const TabContent = styled.div`
  padding: 20px;
  color: #fff;
  font-size: 16px;
`;

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Для чего и кого", content: "Контент для Для чего и кого" },
    { label: "Сюжет игры", content: "Контент для Сюжет игры" },
    { label: "Отзывы", content: "Контент для Отзывы" },
    { label: "Об авторе", content: "Контент для Об авторе" },
    { label: "Поддержка", content: "Контент для Поддержка" },
  ];

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
      <TabContent>{tabs[activeTab].content}</TabContent>
    </TabContainer>
  );
};

export default Tabs;
