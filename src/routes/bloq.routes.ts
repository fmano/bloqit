import express from 'express';
import * as bloqController from '../controllers/bloq.controller';

const router = express.Router();

router.post('/', bloqController.createBloq);
router.get('/', bloqController.getAllBloqs);

export default router;
