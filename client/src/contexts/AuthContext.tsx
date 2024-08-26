import axios from 'axios';
import { useContext, createContext, useState, ReactNode, useEffect } from 'react';
import { useToastContext } from './ToastContext';
import { useNavigate } from 'react-router-dom';

interface Agent {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  country: string;
  state: string;
  phone: string;
  zipcode: number;
  gender: string;
  avatar:string;
  role:string;
}

interface AuthContextType {
  currentUser: Agent | undefined;
  register: (agent: Agent) => Promise<void>;
  login: (loginInfo: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  errors: string | undefined;
  getUser: () => Promise<void>;
  loading:boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Agent | undefined>(undefined);
  const { setToastMessage } = useToastContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string | undefined>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('personal_token');
      if (token) {
        await getUser();
        setLoading(false)
      }else{
        setLoading(false)
      }
    };
    checkUser();
  }, []);  

  

  const register = async (agent: Agent) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}register`, agent, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) {
        localStorage.setItem('personal_token', response.data.token);
        setToastMessage({ type: response.data.status, message: response.data.message });
        navigate('/login');
        setErrors('');
      }
    } catch (err) {
      setErrors('Registration failed. Please try again.');
    }
  };

  const login = async (loginInfo: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}login`, loginInfo, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        localStorage.setItem('personal_token', response.data.token);
        setToastMessage({ type: response.data.status, message: response.data.message });
        setCurrentUser(response.data.user);
        navigate('/');
        setLoading(false)
        setErrors('');
      }
    } catch (err: any) {
      localStorage.removeItem('personal_token');
      setErrors(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const logout = () => {
    if (localStorage.getItem('personal_token')) {
      localStorage.removeItem('personal_token');
      setCurrentUser(undefined);
      navigate('/login');
    } else {
      console.log("You aren't logged in to do this action");
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}user`, { token:localStorage.getItem('personal_token') });
      if (response.status === 200) {
        setCurrentUser(response.data.data.payload.user);
      }else{
        localStorage.removeItem('personal_token');
        setCurrentUser(undefined);
        navigate('/login');
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, errors, logout, getUser,loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
};
