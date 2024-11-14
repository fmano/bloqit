import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bloqRoutes from './routes/bloq.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/bloqs', bloqRoutes);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
