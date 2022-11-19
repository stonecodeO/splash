import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.cgaoqqx.mongodb.net/ `;

const SERVER_PORT = Number(process.env.SERVER_PORT) || 5500;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'myscretaccess';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'mysecretrefresh';
export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    token: {
        access: ACCESS_TOKEN_SECRET,
        refresh: REFRESH_TOKEN_SECRET
    }
};
