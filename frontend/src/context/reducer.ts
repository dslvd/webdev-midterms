import { State, Action } from '../types';

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: { token: action.payload.token, user: action.payload.user },
        error: null,
      };

    case 'FETCH_SUCCESS':
      return { ...state, incidents: action.payload, error: null };

    case 'CREATE_SUCCESS':
      return { ...state, incidents: [...state.incidents, action.payload], error: null };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        incidents: state.incidents.map((incident) =>
          incident.id === action.payload.id ? action.payload : incident
        ),
        error: null,
      };

    case 'DELETE_SUCCESS':
      return {
        ...state,
        incidents: state.incidents.filter((incident) => incident.id !== action.payload.id),
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
