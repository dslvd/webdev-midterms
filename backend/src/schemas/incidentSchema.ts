import { z } from 'zod';

export const Environment = z.enum(['DEVELOPMENT', 'STAGING', 'PRODUCTION']);
export const ServiceStatus = z.enum(['HEALTHY', 'DEGRADED', 'DOWN']);

export const createServiceSchema = z.object({
  name: z.string().min(3, 'Name must be 3-60 characters').max(60, 'Name must be 3-60 characters'),
  endpointUrl: z.string().min(1, 'endpointUrl is required'),
  environment: Environment,
  status: ServiceStatus,
  version: z.string().min(1, 'version is required'),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = z
  .object({
    name: z.string().min(3, 'Name must be 3-60 characters').max(60, 'Name must be 3-60 characters'),
    endpointUrl: z.string().min(1),
    environment: Environment,
    status: ServiceStatus,
    version: z.string().min(1),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

export const deleteServiceSchema = z.object({
  id: z.string().min(1, 'id is required'),
});

export type DeleteServiceInput = z.infer<typeof deleteServiceSchema>;
