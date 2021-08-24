import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useHistory();
    
    const token = sessionStorage.getItem('token');
    const userInfo = sessionStorage.getItem('userInfo');
    const expiresAt = sessionStorage.getItem('expiresAt');
    
    const [authState, setAuthState] = useState({
      token,
      expiresAt,
      userInfo: userInfo ? JSON.parse(userInfo) : {}
    });

    const setAuthInfo = ({ token, userInfo, expiresAt }) => {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      sessionStorage.setItem('expiresAt', expiresAt);
  
      setAuthState({
        token,
        userInfo,
        expiresAt
      });
    };

    const [questions, setQuestions] = useState([])

    const setQuestionsInfo = (questionsInfo) => {
      sessionStorage.setItem('questions', JSON.stringify(questionsInfo));
    }
  
    const logout = () => {
      sessionStorage.clear();
      
      setAuthState({});
      history.push('/');
    };
  
    const isAuthenticated = () => {
      if (!authState.token || !authState.expiresAt) {
        return false;
      }
      return (
        new Date().getTime() / 1000 < authState.expiresAt
      );
    };
  
    return (
      <Provider
        value={{
          questions,
          setQuestions,
          setQuestionsInfo: questionsInfo => setQuestionsInfo(questionsInfo),
          authState,
          setAuthState: authInfo => setAuthInfo(authInfo),
          logout,
          isAuthenticated,
        }}
      >
        {children}
      </Provider>
    );
  };
  
  export { AuthContext, AuthProvider };