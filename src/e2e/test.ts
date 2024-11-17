import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase } from '../db';
import request from 'supertest';
import { app } from '../index';

let mongoServer: MongoMemoryServer;
let readToken: string;
let writeToken: string;

beforeAll(async () => {
  const readUserLoginResponse = await request(app).post('/login').send({
    username: 'readUser',
    role: 'read',
  });

  const writeUserLoginResponse = await request(app).post('/login').send({
    username: 'writeUser',
    role: 'write',
  });

  readToken = readUserLoginResponse.body.authToken;
  writeToken = writeUserLoginResponse.body.authToken;

  await connectToDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET api/bloqs', () => {
  it('should return all bloqs when auth token is provided', async () => {
    const bloqResponse = await request(app)
      .get('/api/bloqs')
      .set('Authorization', `Bearer ${readToken}`);
    console.log(bloqResponse.body);
    expect(bloqResponse.status).toBe(200);
    expect(bloqResponse.body.length).toBeGreaterThan(0);
  });
});
