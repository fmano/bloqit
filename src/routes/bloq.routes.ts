import express, { RequestHandler } from 'express';
import { BloqController } from '../controllers/bloq.controller';
import { checkRole } from '../auth/jwt.auth';

export const bloqRoutes = (bloqController: BloqController) => {
  const router = express.Router();

  router.post(
    '/',
    checkRole('write') as RequestHandler,
    bloqController.create.bind(bloqController),
  );
  router.put(
    '/:id',
    checkRole('write'),
    bloqController.update.bind(bloqController),
  );
  router.delete(
    '/:id',
    checkRole('write'),
    bloqController.delete.bind(bloqController),
  );
  router.get('/', bloqController.getAll.bind(bloqController));
  router.get('/:id', bloqController.getById.bind(bloqController));

  return router;
};
