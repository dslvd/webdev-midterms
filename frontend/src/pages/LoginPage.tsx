import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { apiFetch } from '../api/client';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export function LoginPage() {
  const { state, dispatch } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      dispatch({ type: 'SET_AUTH', payload: { token: data.token, user: data.user } });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Login failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>PulseDesk Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Username</label>
          <br />
          <input
            id="username"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 6 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 6 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <p style={{ fontSize: 12, color: '#666' }}>
        Sample credentials: <code>agent1</code> / <code>password123</code>
      </p>
    </div>
  );
}
