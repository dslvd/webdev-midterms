import bcrypt from 'bcryptjs';
import { User, MicroService } from '../types';

let userIdCounter = 1;
let ServiceStatusIdCounter = 1;

export function nextUserId(): string {
  return String(userIdCounter++);
}

export function nextServiceStatusId(): string {
  return String(ServiceStatusIdCounter++);
}

export const users: User[] = [
  {
    id: nextUserId(),
    email: 'agent1',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'DEVELOPER',
  },
];

const now = new Date().toISOString();

export const services: MicroService[] = [
  {
    id: nextServiceStatusId(),
    name: 'TEST',
    endpointUrl: 'Multiple remote employees reporting slow VPN speeds.',
    environment: 'medium',
    status: 'HEALTHY',
    createdAt: now,
    updatedAt: now,
  },
];
