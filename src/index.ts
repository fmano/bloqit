import express, { Express } from 'express';
import dotenv from 'dotenv';
import { bloqRoutes, lockerRoutes, rentRoutes } from './routes';
import { connectToDatabase } from './db';
import { BloqService, LockerService, RentService } from './services';
import {
  BloqController,
  LockerController,
  RentController,
} from './controllers';
import logger from './utils/logger.util';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

connectToDatabase();

app.use(express.json());

const bloqService = new BloqService();
const bloqController = new BloqController(bloqService);

app.use('/api/bloqs', bloqRoutes(bloqController));

const lockerService = new LockerService();
const lockerController = new LockerController(lockerService);

app.use('/api/lockers', lockerRoutes(lockerController));

const rentService = new RentService();
const rentController = new RentController(rentService);

app.use('/api/rents', rentRoutes(rentController));

app.listen(port, () => {
  logger.info(`Running on http://localhost:${port}`);
});
