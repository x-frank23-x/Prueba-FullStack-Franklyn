import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './functions/AuthContext';
/* const AUTH_COOKIE_NAME = 'access_token';
authCookieName={AUTH_COOKIE_NAME} */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider >
      <App />
    </AuthProvider>
  </React.StrictMode>,
);