import { useEffect, useState, type FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import { apiFetch } from '../api/client';
import type { Microservice, Environment, ServiceStatus } from '../types';

const ENVIRONMENTS: Environment[] = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'];
const STATUSES: ServiceStatus[] = ['HEALTHY', 'DEGRADED', 'DOWN'];

export function ServicesPage() {
  const { state, dispatch } = useAppContext();
  const token = state.token;

  const [name, setName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [environment, setEnvironment] = useState<Environment>('DEVELOPMENT');
  const [status, setStatus] = useState<ServiceStatus>('HEALTHY');
  const [version, setVersion] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await apiFetch<Microservice[]>('/services', {}, token);
        dispatch({ type: 'FETCH_SERVICES_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to load services',
        });
      }
    }
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const service = await apiFetch<Microservice>(
        '/services',
        {
          method: 'POST',
          body: JSON.stringify({ name, endpointUrl, environment, status, version }),
        },
        token
      );
      dispatch({ type: 'CREATE_SERVICE_SUCCESS', payload: service });
      setName('');
      setEndpointUrl('');
      setEnvironment('DEVELOPMENT');
      setStatus('HEALTHY');
      setVersion('');
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to create service',
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: ServiceStatus) {
    try {
      const service = await apiFetch<Microservice>(
        `/services/${id}`,
        { method: 'PATCH', body: JSON.stringify({ status: newStatus }) },
        token
      );
      dispatch({ type: 'UPDATE_SERVICE_SUCCESS', payload: service });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to update status',
      });
    }
  }

  async function handleEnvironmentChange(id: string, newEnvironment: Environment) {
    try {
      const service = await apiFetch<Microservice>(
        `/services/${id}`,
        { method: 'PATCH', body: JSON.stringify({ environment: newEnvironment }) },
        token
      );
      dispatch({ type: 'UPDATE_SERVICE_SUCCESS', payload: service });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to update environment',
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch<void>(`/services/${id}`, { method: 'DELETE' }, token);
      dispatch({ type: 'DELETE_SERVICE_SUCCESS', payload: id });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to delete service',
      });
    }
  }

  const visibleServices =
    state.selectedEnvironment === 'ALL'
      ? state.services
      : state.services.filter((s) => s.environment === state.selectedEnvironment);

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>MicroServices</h1>

      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <form
        onSubmit={handleCreate}
        style={{ marginBottom: 24, border: '1px solid #ccc', padding: 16 }}
      >
        <h2>New Microservice</h2>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: 6 }}
            minLength={3}
            maxLength={60}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="endpointUrl">Endpoint URL</label>
          <br />
          <input
            id="endpointUrl"
            type="text"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
            style={{ width: '100%', padding: 6 }}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="version">Version</label>
          <br />
          <input
            id="version"
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{ width: '100%', padding: 6 }}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="environment">Environment</label>
          <br />
          <select
            id="environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as Environment)}
            style={{ width: '100%', padding: 6 }}
          >
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="status">Status</label>
          <br />
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ServiceStatus)}
            style={{ width: '100%', padding: 6 }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={creating} style={{ padding: '8px 16px' }}>
          {creating ? 'Creating...' : 'Create Service'}
        </button>
      </form>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="env-filter">Filter by environment</label>
        <br />
        <select
          id="env-filter"
          value={state.selectedEnvironment}
          onChange={(e) =>
            dispatch({ type: 'SET_ENV_FILTER', payload: e.target.value as Environment | 'ALL' })
          }
        >
          <option value="ALL">ALL</option>
          {ENVIRONMENTS.map((env) => (
            <option key={env} value={env}>
              {env}
            </option>
          ))}
        </select>
      </div>

      <h2>All Microservices</h2>
      {visibleServices.length === 0 && <p>No microservices.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {visibleServices.map((service) => (
          <li
            key={service.id}
            style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10 }}
          >
            <strong>{service.name}</strong> <span>v{service.version}</span>
            <p style={{ margin: '4px 0' }}>{service.endpointUrl}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <label>
                Status:{' '}
                <select
                  value={service.status}
                  onChange={(e) =>
                    handleStatusChange(service.id, e.target.value as ServiceStatus)
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
                Environment:{' '}
                <select
                  value={service.environment}
                  onChange={(e) =>
                    handleEnvironmentChange(service.id, e.target.value as Environment)
                  }
                >
                  {ENVIRONMENTS.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={() => handleDelete(service.id)} style={{ padding: '4px 10px' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
