import express from 'express';
import { RentController } from '../controllers/rent.controller';
import { checkRole } from '../auth/jwt.auth';

export const rentRoutes = (rentController: RentController) => {
  const router = express.Router();

  router.post(
    '/',
    checkRole('write'),
    rentController.create.bind(rentController),
  );
  router.delete(
    '/:id',
    checkRole('write'),
    rentController.delete.bind(rentController),
  );
  router.get('/', rentController.getAll.bind(rentController));
  router.get('/:id', rentController.getById.bind(rentController));
  router.patch(
    '/:id',
    checkRole('write'),
    rentController.update.bind(rentController),
  );
  return router;
};
