import express from 'express';
import { LockerController } from '../controllers/locker.controller';

export const lockerRoutes = (lockerController: LockerController) => {
  const router = express.Router();

  router.post('/', lockerController.create.bind(lockerController));
  router.put('/:id', lockerController.update.bind(lockerController));
  router.delete('/:id', lockerController.delete.bind(lockerController));
  router.get('/', lockerController.getAll.bind(lockerController));
  router.get('/:id', lockerController.getById.bind(lockerController));

  return router;
};
