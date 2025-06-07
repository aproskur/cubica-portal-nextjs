'use client';

import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/modals/LoginModal';

const ClientWrapperAuth = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  return <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />;
};

export default ClientWrapperAuth;
