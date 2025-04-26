"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { updateUserPassword } from "@/utils/apiService";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: rgb(var(--background));
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(var(--theme-yellow), 0.3);
  position: relative;
  text-align: center;

  h2 {
    padding: 1rem 0;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgb(var(--theme-yellow));

  &:hover {
    color: rgb(var(--foreground));
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(var(--theme-grey), 0.5);
  border-radius: 5px;
  font-size: 16px;
  color: rgb(var(--foreground));
  background: rgb(var(--background));

  &:focus {
    outline: none;
    border-color: rgb(var(--theme-yellow));
    box-shadow: 0px 0px 8px rgba(var(--theme-yellow), 0.5);
  }

  &::placeholder {
    color: rgba(var(--foreground), 0.6);
  }
`;

const StyledButton = styled.button`
  width: 100%;
  background: rgb(var(--theme-yellow));
  padding: 10px;
  border: 1px solid rgb(var(--theme-yellow));
  border-radius: 5px;
  color: black;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: rgb(var(--theme-grey));
    color: white;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ToggleIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgba(var(--theme-grey), 0.7);
  font-size: 20px;

  &:hover {
    color: rgb(var(--theme-yellow));
  }
`;

const MessageBox = styled.div`
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  font-size: 14px;
  color: ${(props) => (props.type === "error" ? "rgb(var(--error))" : "rgb(var(--success))")};
  background-color: ${(props) =>
    props.type === "error"
      ? "rgba(var(--error), 0.1)"
      : "rgba(var(--success), 0.1)"};
  border: 1px solid
    ${(props) =>
    props.type === "error" ? "rgb(var(--error))" : "rgb(var(--success))"};
`;


const UserProfileModal = () => {
  const { user, isProfileModalOpen, closeProfileModal } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'


  useEffect(() => {
    if (isProfileModalOpen && user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPassword("");
      setCurrentPassword("");
    }
  }, [isProfileModalOpen, user]);

  if (!isProfileModalOpen) return null;


  const handleSave = async () => {
    setMessage("");
    setMessageType(null);

    try {
      const result = await updateUserPassword(currentPassword, password);

      if (!result.success) {
        let errorMessage = "Ошибка при обновлении пароля";

        try {
          if (result.error) {
            if (typeof result.error === "string") {
              errorMessage = result.error;
            } else if (typeof result.error === "object") {
              // Try several possible places where a useful message might be
              errorMessage =
                result.error.message ||
                result.error.error ||
                result.error.data?.message ||
                JSON.stringify(result.error);
            }
          }
        } catch (parseError) {
          console.error("Error parsing error object", parseError);
        }

        setMessage(errorMessage);
        setMessageType("error");
        return;
      }

      setMessage("Пароль успешно обновлён");
      setMessageType("success");


      /* if it is needed to close modal after successful password reset
      setTimeout(() => {
        closeProfileModal();
      }, 1500); */
    } catch (err) {
      console.error("Unexpected error:", err);

      let fallbackMessage = "Произошла ошибка при сохранении";

      try {
        if (typeof err === "string") {
          fallbackMessage = err;
        } else if (typeof err === "object") {
          fallbackMessage =
            err.message ||
            err.error?.message ||
            err.data?.message ||
            JSON.stringify(err);
        }
      } catch (innerErr) {
        console.error("Error parsing catch block error:", innerErr);
      }

      setMessage(fallbackMessage);
      setMessageType("error");
    }
  };


  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeProfileModal}>&times;</CloseButton>
        <h2>Личный угол</h2>

        <p style={{ textAlign: "left", padding: ".5rem 0" }}> {username} </p>
        <p style={{ textAlign: "left", padding: ".5rem 0", marginBottom: "1rem" }}> {email}</p>

        <PasswordWrapper>
          <StyledInput
            type={showPassword ? "text" : "password"}
            placeholder="Текущий пароль"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <ToggleIcon onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </ToggleIcon>
        </PasswordWrapper>

        <PasswordWrapper>
          <StyledInput
            type={showPassword ? "text" : "password"}
            placeholder="Новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ToggleIcon onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </ToggleIcon>
        </PasswordWrapper>

        <StyledButton onClick={handleSave}>Сохранить</StyledButton>
        {message && <MessageBox type={messageType}>{message}</MessageBox>}

      </ModalContent>
    </ModalOverlay>
  );
};

export default UserProfileModal;
