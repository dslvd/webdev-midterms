import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createIncidentSchema, updateIncidentSchema } from '../schemas/incidentSchema';
import {
  createIncident,
  listMicroservice,
  updateIncident,
  deleteIncident,
} from '../controllers/incidentController';

const router = Router();

router.use(authenticate);

router.post('/', validate(createIncidentSchema), createIncident);
router.get('/', listMicroservice);
router.patch('/:id', validate(updateIncidentSchema), updateIncident);
router.delete('/:id', deleteIncident);

export default router;
