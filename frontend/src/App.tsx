import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { IncidentsPage } from './pages/IncidentsPage';

function Main() {
  const { state } = useAppContext();

  function handleLogout() {
    try {
      localStorage.removeItem('pulsedesk_token');
      localStorage.removeItem('pulsedesk_user');
    } catch {
      // ignore storage errors
    }
    window.location.reload();
  }

  if (!state.auth.token) {
    return <LoginPage />;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '8px 16px',
          fontFamily: 'sans-serif',
        }}
      >
        <span style={{ marginRight: 12 }}>
          Signed in as {state.auth.user?.name ?? state.auth.user?.username}
        </span>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <IncidentsPage />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
