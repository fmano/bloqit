import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('get');
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
