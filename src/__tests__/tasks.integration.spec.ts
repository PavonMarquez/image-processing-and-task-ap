import request from 'supertest';
import mongoose from 'mongoose';
import { envs } from '../configs/env-var';
import app from '../server';

const {
  MONGO_INITDB_USERNAME,
  MONGO_INITDB_PASSWORD,
  MONGO_URL,
  MONGO_INITDB_DATABASE
} = envs;

describe('Tasks Integration Tests', () => {

  let createdTaskId: string;


  beforeAll(async () => {
    await mongoose.connect(
      `mongodb://${MONGO_INITDB_USERNAME}:${MONGO_INITDB_PASSWORD}@${MONGO_URL}/${MONGO_INITDB_DATABASE}?authSource=admin`
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new task from a valid image URL', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        target: 'https://s1.1zoom.me/big3/117/423843-Kycb.jpg'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('taskId');
    expect(response.body).toHaveProperty('status', 'pending');
    expect(response.body).toHaveProperty('price');

    createdTaskId = response.body.taskId;
  });

  it('should return task data with image variants for a valid taskId', async () => {
    const response = await request(app).get(`/tasks/${createdTaskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('taskId', createdTaskId);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('price');


    if (response.body.status === 'completed') {
      expect(response.body).toHaveProperty('image');
      expect(response.body.image.resizedVariants.length).toBeGreaterThan(0);
    }
  });
});
