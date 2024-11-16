import express from 'express';
import * as bloqController from '../controllers/bloq.controller';

const router = express.Router();

router.post('/', bloqController.createBloq);
router.put('/:id', bloqController.updateBloq);
router.delete('/:id', bloqController.deleteBloq);
router.get('/', bloqController.getBloqs);
router.get('/:id', bloqController.getBloqById);

export default router;
