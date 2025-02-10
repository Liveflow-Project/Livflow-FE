import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '@/api/axiosInstance';

type AuthContextType = {
  isLoggedIn: boolean;
  isInitialized: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 로그인 상태 확인
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // 토큰 유효성 검증 API 호출
        const response = await axiosInstance.get('/users/token/verify/');

        setIsLoggedIn(response.status === 200);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsInitialized(true);
      }
    };

    verifyToken();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isInitialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth Hook은 AuthProvider 내부에서만 사용할 수 있습니다. ' +
        '컴포넌트가 AuthProvider로 감싸져 있는지 확인해주세요.'
    );
  }
  return context;
};
