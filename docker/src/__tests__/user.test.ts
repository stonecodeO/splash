const request = require('supertest');
import createServer from '../utils/server';
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
import { config } from '../config/config';
import userService from '../services/user';
import bcript from 'bcrypt';

const app = createServer();

const userPayload = {
    username: 'stonecode',
    email: 'stonecode@local.dev',
    password: 'stonecode'
};
const userPayload2 = {
    _id: new mongoose.Types.ObjectId(),
    username: 'john',
    email: 'john.doe@local.dev',
    password: 'password',
    role: {
        user: 'user'
    }
};
/* const postPayload = {
    title: 'my post',
    description: 'my post description',
    author: userPayload._id
}; */

describe('Account ', () => {
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
    describe('Login ts_account_001', () => {
        describe('Given a valid username and password', () => {
            it('should login and return a status 200 and a an access token', async () => {
                //mock findUser services
                //@ts-ignore
                const findUserServiceMock = jest.spyOn(userService, 'findUser').mockReturnValue({ email: 'stonecode' });
                //mocking bcript
                const bcriptCompare = jest.fn().mockReturnValue(true);
                (bcript.compare as jest.Mock) = bcriptCompare;
                //mockin save user
                //@ts-ignore
                const saveUserServiceMock = jest.spyOn(userService, 'save').mockReturnValue(userPayload);
                const { body, statusCode, headers } = await request(app).post('/api/auth/login').send({ email: 'stonecode@local.dev', password: 'stonecode' });
                expect(statusCode).toBe(200);
                expect(body).toEqual({ accessToken: expect.any(String) });
                expect(headers['set-cookie']).toBeTruthy();
                expect(bcriptCompare).toHaveBeenCalled();
                expect(saveUserServiceMock).toHaveBeenCalledTimes(1);
            });
        });
    });
});

/* describe('user', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });
    describe('about one user', () => {
        describe('user route should not exist', () => {
            it('should return 404', async () => {
                const userId = new mongoose.Types.ObjectId();
                console.log(userId);
                const res = await request(app).get(`/api/users/user/${userId}`);
                expect(res.statusCode).toBe(404);
            });
        });
        describe('user route should exist', () => {
            //create a valid token for the
            const refreshToken = jwt.sign({ username: userPayload2.username, roles: userPayload2.role }, config.token.access, { expiresIn: '300s' });
            //@ts-ignore
            const createUserServiceMock = jest.spyOn(userService, 'createUser').mockReturnValue(userPayload);
            console.log(createUserServiceMock);
            it('should return 200', async () => {
                const res = await request(app).get(`/api/users/show/${userPayload2._id}`);
                expect(res.statusCode).toEqual(200);
            });
        });
    });
    describe.skip('given the user is logged in', () => {
        it('should resturn a status 200 and create post', async () => {
            const refreshToken = jwt.sign({ username: userPayload2.username, roles: userPayload2.role }, config.token.access, { expiresIn: '300s' });

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
});
 */
