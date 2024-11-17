import express, { Express, Request, Response } from 'express';
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
import { generateToken } from './auth/jwt.auth';

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

connectToDatabase();

app.use(express.json());

// simulate login to allow testing different user role access
app.post('/login', (req: Request, res: Response) => {
  const { username, role } = req.body;
  if (username && role) {
    const token = generateToken({ username, role });
    res.json({ authToken: token });
  } else {
    res.status(400).json({ message: 'Username and role required' });
  }
});

const bloqService = new BloqService();
const bloqController = new BloqController(bloqService);

app.use('/api/bloqs', bloqRoutes(bloqController));

const lockerService = new LockerService();
const lockerController = new LockerController(lockerService);

app.use('/api/lockers', lockerRoutes(lockerController));

const rentService = new RentService(lockerService);
const rentController = new RentController(rentService);

app.use('/api/rents', rentRoutes(rentController));

app.listen(port, () => {
  logger.info(`Running on ${env} at http://localhost:${port}`);
});
