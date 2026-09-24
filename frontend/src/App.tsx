import { AppProvider, useAppContext } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { ServicesPage } from './pages/MicroServicesDashboard';

function Main() {
  const { state, dispatch } = useAppContext();

  function handleLogout() {
    dispatch({ type: 'LOGOUT' });
  }

  if (!state.token) {
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
          Signed in as {state.user?.name}
        </span>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <ServicesPage />
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
