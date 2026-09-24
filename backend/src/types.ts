export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export type Enviroment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export interface Microservice {
  id: string;
  name: string;
  endpointUrl: string;
  enviroment: Enviroment;
  status: ServiceStatus;
  version: string; // id of the user who reported the item
  ownerEmail: string;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: Role;
}

// Augment Express's Request type with the authenticated user set by middleware.
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
