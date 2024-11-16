import express from 'express';
import { BloqController } from '../controllers/bloq.controller';

export const bloqRoutes = (bloqController: BloqController) => {
  const router = express.Router();

  router.post('/', bloqController.create.bind(bloqController));
  router.put('/:id', bloqController.update.bind(bloqController));
  router.delete('/:id', bloqController.delete.bind(bloqController));
  router.get('/', bloqController.getAll.bind(bloqController));
  router.get('/:id', bloqController.getById.bind(bloqController));

  return router;
};
