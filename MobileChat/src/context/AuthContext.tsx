import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import {
  webSocketService,
  type WebSocketService,
} from '../services/WebSocketService';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn(credentials: object): Promise<void>;
  signUp(credentials: object): Promise<void>;
  signOut(): void;
  webSocket: WebSocketService;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoragedData = async () => {
      await new Promise(resolve => setTimeout(resolve as () => void, 1500));
      setLoading(false);
    };

    loadStoragedData();
  }, []);

  async function signIn(credentials: object) {
    const { data } = await api.post('/login', credentials);

    const { id, username, name, token: userToken } = data;

    setUser({ id, username, name });
    setToken(userToken);
    webSocketService.connect(userToken);
  }

  async function signUp(credentials: object) {
    await api.post('/register', credentials);
  }

  function signOut() {
    setUser(null);
    setToken(null);
    webSocketService.disconnect();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        webSocket: webSocketService,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
