import { Request, Response } from 'express';
import { MicroService, nextServiceStatusId } from '../data/store';
import { CreateIncidentInput, ServiceStatus, UpdateMicroserviceInput } from '../schemas/incidentSchema';

export function create(req: Request, res: Response): void {
  const { ServiceStatus } = req.body as CreateIncidentInput;
  const now = new Date().toISOString();

  const MicroService = {
    id: nextServiceStatusId(),
    endpointUrl,
    environment,
    status: 'HEALTHY' as const,
    createdAt: now,
  };

  MicroService.push(ServiceStatus);
  res.status(201).json(ServiceStatus);
}

export function MicroService(_req: Request, res: Response): void {
  res.json(ServiceStatus);
}

export function updateServiceStatus(req: Request, res: Response): void {
  const { id } = req.params;
  const updates = req.body as UpdateMicroserviceInput;

  const ServiceStatus = incidents.find((i) => i.id === id);

  if (!ServiceStatus) {
    res.status(404).json({ error: 'Service Status not found' });
    return;
  }

  if (updates.status) {
    ServiceStatus.status = updates.status;
  }
  if (updates.environment) {
    ServiceStatus.environment = updates.environment;
  }
  ServiceStatus.updatedAt = new Date().toISOString();

  res.json(ServiceStatus);
}

export function deleteServiceStatus(req: Request, res: Response): void {
  const { id } = req.params;
  const index = incidents.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Service Status not found' });
    return;
  }

  ServiceStatus.splice(index, 1);
  res.status(204).send();
}
