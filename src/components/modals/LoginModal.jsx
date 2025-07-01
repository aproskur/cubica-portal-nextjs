'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

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
  const { login, register, isLoginModalOpen } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState(''); // Only needed for registration
  const [identifier, setIdentifier] = useState('');

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegisterMode) {
      if (!email.trim() || !username.trim() || !password.trim()) {
        showToast('Пожалуйста, заполните все поля', 3000, 'top-center');
        return;
      }

      // Simple email format check
      if (!/\S+@\S+\.\S+/.test(email)) {
        showToast('Введите корректный email', 3000, 'top-center');
        return;
      }

      if (password.length < 6) {
        showToast('Пароль должен быть не менее 6 символов', 3000, 'top-center');
        return;
      }
    } else {
      if (!identifier.trim() || !password.trim()) {
        showToast('Введите логин и пароль', 3000, 'top-center');
        return;
      }
    }

    try {
      if (isRegisterMode) {
        await register(username, email, password);
        showToast('Регистрация прошла успешно!', 3000, 'top-center');
      } else {
        await login(identifier, password);
        showToast('С возвращением!', 3000, 'top-center');
      }
      onClose();
    } catch (err) {
      showToast(err.message || 'Произошла ошибка.', 3000, 'top-center');
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const handleClose = () => {
    setIdentifier('');
    setEmail('');
    setUsername('');
    setPassword('');
    setIsRegisterMode(false);
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <h2>{isRegisterMode ? 'Регистрация' : 'Вход'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          {isRegisterMode ? (
            <>
              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <StyledInput
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </>
          ) : (
            <StyledInput
              type="text"
              placeholder="Email или имя пользователя"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          )}

          <StyledInputWrapper>
            <StyledInput
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeIcon onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
            </EyeIcon>
          </StyledInputWrapper>

          <StyledButton type="submit">
            {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
          </StyledButton>
        </form>

        <ToggleText onClick={toggleMode}>
          {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </ToggleText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
