import { Request, Response } from 'express';
import * as store from '../data/store';
import type { CreateServiceInput, UpdateServiceInput } from '../schemas/statusSchema';

export async function createService(req: Request, res: Response): Promise<void> {
  const { name, endpointUrl, environment, status, version } = req.body as CreateServiceInput;

  const service = await store.createService({
    name,
    endpointUrl,
    environment,
    status,
    version,
    ownerEmail: req.user?.email ?? '',
  });

  res.status(201).json(service);
}

export async function listServices(_req: Request, res: Response): Promise<void> {
  res.json(await store.listServices());
}

export async function updateService(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const updates = req.body as UpdateServiceInput;

  const service = await store.updateService(id, updates);

  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  res.json(service);
}

export async function deleteService(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const deleted = await store.deleteService(id);

  if (!deleted) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  res.status(204).send();
}
