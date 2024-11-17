import express from 'express';
import { RentController } from '../controllers/rent.controller';

export const rentRoutes = (rentController: RentController) => {
  const router = express.Router();

  router.post('/', rentController.create.bind(rentController));
  router.delete('/:id', rentController.delete.bind(rentController));
  router.get('/', rentController.getAll.bind(rentController));
  router.get('/:id', rentController.getById.bind(rentController));
  router.patch('/:id', rentController.update.bind(rentController));
  return router;
};