import type { State, Action } from '../types';

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case 'LOGOUT':
      return { ...state, user: null, token: null, services: [] };

    case 'SET_ENV_FILTER':
      return { ...state, selectedEnvironment: action.payload };

    case 'FETCH_SERVICES_SUCCESS':
      return { ...state, services: action.payload, error: null };

    case 'CREATE_SERVICE_SUCCESS':
      return { ...state, services: [...state.services, action.payload], error: null };

    case 'UPDATE_SERVICE_SUCCESS':
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        ),
        error: null,
      };

    case 'DELETE_SERVICE_SUCCESS':
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
