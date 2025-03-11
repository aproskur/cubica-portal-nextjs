"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { loginUser, registerUser } from "@/utils/OUTDATEDauthService";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

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

const StyledInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  padding-right: 40px; 
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

const EyeIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgb(var(--theme-grey));
  font-size: 18px;

  &:hover {
    color: rgb(var(--theme-yellow));
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

const ToggleText = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: rgb(var(--theme-grey));
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: rgb(var(--theme-yellow));
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState(""); // Only needed for registration

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegisterMode) {
        await register(username, email, password);
      } else {
        await login(email, password);
      }
      onClose();
      //router.push("/games/my");
    } catch (err) {
      setError(err.message || "Operation failed.");
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
    setIsRegisterMode(false);
    onClose();
  };



  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <h2>{isRegisterMode ? "Регистрация" : "Вход"}</h2>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <StyledInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <StyledInputWrapper>
            <StyledInput
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeIcon onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
            </EyeIcon>
          </StyledInputWrapper>

          {isRegisterMode && (
            <StyledInput
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <StyledButton type="submit">
            {isRegisterMode ? "Зарегистрироваться" : "Войти"}
          </StyledButton>

        </form>
        <ToggleText onClick={toggleMode}>
          {isRegisterMode ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </ToggleText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
