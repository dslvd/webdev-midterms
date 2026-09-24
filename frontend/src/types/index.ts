export type Environment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export interface MicroService {
  id: string;
  name: string;
  endpointUrl: string;
  environment: Environment;
  status: ServiceStatus;
  ownerEmail: string;
  createdAt: string;
}

export interface User {
  name: string;
  id: string;
  email: string;
  passwordHash: string;
  role: 'DEVELOPER' | 'LEAD';
}

export interface State {
  auth: {
    token: string | null;
    user: User | null;
  };
  services: MicroService[];
  selectedEnvironment: Environment | 'ALL';
  MicroService: ServiceStatus[];
  error: string | null;
}

export type Action =
| { type: 'SET_AUTH'; payload: { user: any; token: string } }
| { type: 'LOGOUT' }
| { type: 'SET_ENV_FILTER'; payload: Environment | 'ALL' }
| { type: 'FETCH_SUCCESS'; payload: MicroService[] }
| { type: 'CREATE_SUCCESS'; payload: MicroService }
| { type: 'UPDATE_SUCCESS'; payload: MicroService }
| { type: 'DELETE_SUCCESS'; payload: string }
| { type: 'SET_ERROR'; payload: string | null };
// export type Action =
//   | { type: 'SET_AUTH'; payload: { token: string; user: AuthUser } }
//   | { type: 'FETCH_SUCCESS'; payload: Incident[] }
//   | { type: 'CREATE_SUCCESS'; payload: Incident }
//   | { type: 'UPDATE_SUCCESS'; payload: Incident }
//   | { type: 'DELETE_SUCCESS'; payload: { id: string } }
//   | { type: 'SET_ERROR'; payload: string };
