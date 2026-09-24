import { z } from 'zod';

export const Environment = z.enum(['DEVELOPMENT', 'STAGING', 'PRODUCTION']);
export const ServiceStatus = z.enum(['HEALTHY', 'DEGRADED', 'DOWN']);

export const createIncidentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  severity: Environment,
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;

export const updateIncidentSchema = z
  .object({
    status: ServiceStatus.optional(),
    environment: Environment.optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (status or environment) must be provided',
  });

export type UpdateMicroserviceInput = z.infer<typeof updateIncidentSchema>;
