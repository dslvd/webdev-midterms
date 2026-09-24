import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { apiFetch } from '../api/client';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';

const SEVERITIES: IncidentSeverity[] = ['low', 'medium', 'high', 'critical'];
const STATUSES: IncidentStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

export function IncidentsPage() {
  const { state, dispatch } = useAppContext();
  const token = state.auth.token;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('low');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const data = await apiFetch<Incident[]>('/incidents', {}, token);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to load incidents',
        });
      }
    }
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const incident = await apiFetch<Incident>(
        '/incidents',
        {
          method: 'POST',
          body: JSON.stringify({ title, description, severity }),
        },
        token
      );
      dispatch({ type: 'CREATE_SUCCESS', payload: incident });
      setTitle('');
      setDescription('');
      setSeverity('low');
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to create incident',
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(id: string, status: IncidentStatus) {
    try {
      const incident = await apiFetch<Incident>(
        `/incidents/${id}`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        token
      );
      dispatch({ type: 'UPDATE_SUCCESS', payload: incident });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to update status',
      });
    }
  }

  async function handleSeverityChange(id: string, newSeverity: IncidentSeverity) {
    try {
      const incident = await apiFetch<Incident>(
        `/incidents/${id}`,
        { method: 'PATCH', body: JSON.stringify({ severity: newSeverity }) },
        token
      );
      dispatch({ type: 'UPDATE_SUCCESS', payload: incident });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to update severity',
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch<void>(`/incidents/${id}`, { method: 'DELETE' }, token);
      dispatch({ type: 'DELETE_SUCCESS', payload: { id } });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to delete incident',
      });
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>PulseDesk Incidents</h1>

      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <form
        onSubmit={handleCreate}
        style={{ marginBottom: 24, border: '1px solid #ccc', padding: 16 }}
      >
        <h2>New Incident</h2>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="title">Title</label>
          <br />
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: 6 }}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: 6 }}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="severity">Severity</label>
          <br />
          <select
            id="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
            style={{ width: '100%', padding: 6 }}
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={creating} style={{ padding: '8px 16px' }}>
          {creating ? 'Creating...' : 'Create Incident'}
        </button>
      </form>

      <h2>All Incidents</h2>
      {state.incidents.length === 0 && <p>No incidents.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {state.incidents.map((incident) => (
          <li
            key={incident.id}
            style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10 }}
          >
            <strong>{incident.title}</strong>
            <p style={{ margin: '4px 0' }}>{incident.description}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <label>
                Status:{' '}
                <select
                  value={incident.status}
                  onChange={(e) =>
                    handleStatusChange(incident.id, e.target.value as IncidentStatus)
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Severity:{' '}
                <select
                  value={incident.severity}
                  onChange={(e) =>
                    handleSeverityChange(incident.id, e.target.value as IncidentSeverity)
                  }
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={() => handleDelete(incident.id)} style={{ padding: '4px 10px' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
