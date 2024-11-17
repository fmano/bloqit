import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase } from '../db';
import request from 'supertest';
import { app } from '../index';
import { configDotenv } from 'dotenv';
import { Rent } from '../models';
import { loadInitialDataToDb } from '../utils/db.util';

let readToken: string;
let writeToken: string;

configDotenv();

beforeAll(async () => {
  process.env.NODE_ENV = 'test'; // Set environment to test
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

  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map((collection) => {
      collection.deleteMany({});
    }),
  );

  await loadInitialDataToDb();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('E2E', () => {
  it('should allow creating and updating bloqs, lockers and rents', async () => {
    /*
     * Create a Bloq, check if number of Bloqs increased, get a locker by ID,
     * create a rent inside that locker, try to create another inside the same locker
     * and expect the second to fail
     */

    const initialBloqResponse = await request(app)
      .get('/api/bloqs')
      .set('Authorization', `Bearer ${readToken}`);

    expect(initialBloqResponse.status).toBe(200);
    expect(initialBloqResponse.body.length).toBe(3);

    const createBloqResponse = await request(app)
      .post('/api/bloqs')
      .set('Authorization', `Bearer ${writeToken}`)
      .send({
        title: 'a new bloq',
        address: 'Main Street',
      });

    expect(createBloqResponse.status).toBe(201);

    const afterCreateBloqResponse = await request(app)
      .get('/api/bloqs')
      .set('Authorization', `Bearer ${readToken}`);

    expect(afterCreateBloqResponse.body.length).toBe(4);

    const getLockerByIdResponse = await request(app)
      .get('/api/lockers/8b4b59ae-8de5-4322-a426-79c29315a9f1')
      .set('Authorization', `Bearer ${readToken}`);

    expect(getLockerByIdResponse.status).toBe(200);
    expect(getLockerByIdResponse.body.id).toEqual(
      '8b4b59ae-8de5-4322-a426-79c29315a9f1',
    );

    const createRentResponse = await request(app)
      .post('/api/rents')
      .set('Authorization', `Bearer ${writeToken}`)
      .send({
        lockerId: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
        weight: 20,
        size: 'M',
        status: 'waiting_pickup',
      });

    expect(createRentResponse.status).toBe(201);

    const createRentOnOccupiedLockerResponse = await request(app)
      .post('/api/rents')
      .set('Authorization', `Bearer ${writeToken}`)
      .send({
        lockerId: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
        weight: 20,
        size: 'M',
        status: 'waiting_pickup',
      });

    expect(createRentOnOccupiedLockerResponse.status).toBe(400);

    const moveExistingRentToOccupiedLockerResponse = await request(app)
      .patch('/api/rents/84ba232e-ce23-4d8f-ae26-68616600df48')
      .set('Authorization', `Bearer ${writeToken}`)
      .send({
        lockerId: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
        status: 'WAITING_PICKUP',
      });

    expect(moveExistingRentToOccupiedLockerResponse.status).toBe(400);
  });
});
