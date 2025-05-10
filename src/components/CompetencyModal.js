"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { fetchAllCompetencies } from "@/utils/apiService";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgb(var(--background));
  color: rgb(var(--foreground));
  border: 1px solid rgba(var(--theme-yellow), 0.2);
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px; right: 10px;
  cursor: pointer;
  font-size: 20px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 14px;
`;

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  background: inherit;
  border: 1px solid rgb(var(--theme-grey));
  color: rgb(var(--theme-yellow));
  border-radius: 5px;
  cursor: pointer;
  font-family: var(--font-montserrat), Arial, Helvetica, sans-serif;

  &:hover {
    border-color: rgb(var(--theme-yellow));
    color: rgb(var(--foreground));
  }
`;

const CompetencyModal = ({ gameId, currentCompetencies, onClose, onSave, updateField }) => {
  const [allCompetencies, setAllCompetencies] = useState([]);
  const [selected, setSelected] = useState([]);

  console.log("Modal currentCompetencies (props):", currentCompetencies);

  useEffect(() => {
    if (Array.isArray(currentCompetencies)) {
      setSelected(currentCompetencies.map(String)); 
    }
  }, [currentCompetencies]);
  
 

  useEffect(() => {
    const loadCompetencies = async () => {
      const fetchedCompetencies = await fetchAllCompetencies();
      setAllCompetencies(fetchedCompetencies);
    };
    loadCompetencies();
  }, []);
  

  const handleToggle = (id) => {
    const stringId = String(id);
    setSelected((prev) =>
      prev.includes(stringId)
        ? prev.filter((v) => v !== stringId)
        : [...prev, stringId]
    );
  };
  
  

  const handleSave = async () => {
    try {
      console.log("Selected competency IDs to send:", selected);
      await updateField({ competencies: selected });
      const updatedCompetencies = allCompetencies.filter(c => selected.includes(c.id));
onSave(updatedCompetencies); // send full objects like { id, name }

    } catch (err) {
      console.error("Failed to update competencies", err);
    } finally {
      onClose();
    }
  };
  

  console.log("currentCompetencies", currentCompetencies);

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <h3>Выберите компетенции</h3>
        {allCompetencies.map(({ id, name }) => (
  <CheckboxWrapper key={id}>
    <input
  type="checkbox"
  checked={selected.includes(String(id))}

  onChange={() => handleToggle(id)}

      style={{ marginRight: "10px" }}
    />
    {name.charAt(0).toUpperCase() + name.slice(1)}
  </CheckboxWrapper>
))}


        <SaveButton onClick={handleSave}>Сохранить</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CompetencyModal;