import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServiceSchema, updateServiceSchema, deleteServiceSchema } from '../schemas/incidentSchema';
import {
  createService,
  listServices,
  updateService,
  deleteService,
} from '../controllers/incidentController';

const router = Router();

router.use(authenticate);

router.post('/', validate(createServiceSchema), createService);
router.get('/', listServices);
router.patch('/:id', validate(updateServiceSchema), updateService);
router.delete('/:id', validate(deleteServiceSchema, 'params'), deleteService);

export default router;
