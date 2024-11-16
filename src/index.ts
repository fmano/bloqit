import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { bloqRoutes } from './routes/bloq.routes';
import { connectToDatabase } from './db';
import { BloqService } from './services/bloq.service';
import { BloqController } from './controllers/bloq.controller';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

connectToDatabase();

app.use(express.json());

const bloqService = new BloqService();
const bloqController = new BloqController(bloqService);

app.use('/api/bloqs', bloqRoutes(bloqController));

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
