import express from 'express';
import { LockerController } from '../controllers/locker.controller';
import { checkRole } from '../auth/jwt.auth';

export const lockerRoutes = (lockerController: LockerController) => {
  const router = express.Router();

  router.post(
    '/',
    checkRole('write'),
    lockerController.create.bind(lockerController),
  );
  router.put(
    '/:id',
    checkRole('write'),
    lockerController.update.bind(lockerController),
  );
  router.delete(
    '/:id',
    checkRole('write'),
    lockerController.delete.bind(lockerController),
  );
  router.get('/', lockerController.getAll.bind(lockerController));
  router.get('/:id', lockerController.getById.bind(lockerController));

  return router;
};
