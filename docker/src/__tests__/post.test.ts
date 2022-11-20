import request from 'supertest';
import jwt from 'jsonwebtoken'
import router from '../utils/server'
import mongoose from 'mongoose';
import {config} from '../config/config';
import  { MongoClient} from 'mongodb';
import postService from '../services/post';

const app = router();
const userPayload = {
    _id: new mongoose.Types.ObjectId(),
    username: 'john',
    email: 'john.doe@local.dev',
    password: 'password',
    role: {
        user: 'user'
    }
};
const postPayload = {
    title: 'my post',
    description: 'my post description',
    author: userPayload._id,
};
describe('Blog',() => {
    const client = new MongoClient(config.mongo.url);
    async function start() {
        try {
            await client.connect();
        } catch (error) {
            console.log(error);
        }
    }
    beforeAll(async () => {
        start();
    });
    afterAll(async () => {
        client.close();
    });
   describe('operate on one post', () => {
    describe('given the user is logged in', () => {
        it('should return a status 200 and create post', async () => {
            const refreshToken = jwt.sign({ username: userPayload.username, roles: userPayload.role }, config.token.access, { expiresIn: '300s' });
            //@ts-ignore            
            const savePostServiceMock = jest.spyOn(postService, 'createPost').mockReturnValue(postPayload);

            const { statusCode, body } = await request(app).post('/api/posts/new_post').set('Authorization', `Bearer ${refreshToken}`).send(postPayload);

            expect(statusCode).toBe(201);
            expect(body).toEqual({
                post: {
                    __v: 0,
                    _id: expect.any(String),
                    author: expect.any(String),
                    createdAt: expect.any(String),
                    description: 'my post description',
                    medias: [],
                    title: 'my post',
                    updatedAt: expect.any(String)
                }
            });
        });
    }); 
   })
});