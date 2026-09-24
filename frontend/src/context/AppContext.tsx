import React, { createContext, useContext, useEffect, useReducer, Dispatch } from 'react';
import { reducer } from './reducer';
import { State, Action, AuthUser } from '../types';

const TOKEN_KEY = 'pulsedesk_token';
const USER_KEY = 'pulsedesk_user';

function getInitialState(): State {
  let token: string | null = null;
  let user: AuthUser | null = null;

  try {
    token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
  } catch {
    token = null;
    user = null;
  }

  return {
    auth: { token, user },
    ServiceStatus: [],
    error: null,
  };
}

interface AppContextValue {
  state: State;
  dispatch: Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    try {
      if (state.auth.token) {
        localStorage.setItem(TOKEN_KEY, state.auth.token);
        localStorage.setItem(USER_KEY, JSON.stringify(state.auth.user));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [state.auth]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
