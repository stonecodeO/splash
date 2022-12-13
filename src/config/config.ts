import dotenv from 'dotenv';

dotenv.config();

const env = process.env.env || 'local';
const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
let MONGO_URL = 'mongodb://localhost:27017/splash';
let REDIS_URL = process.env.REDIS_URL || '';

if(env === 'local_docker'){
    MONGO_URL = 'mongodb://mongo:27017/splash';
    REDIS_URL = 'redis://redis:6379';
}else{
    MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.cgaoqqx.mongodb.net/ `;
}

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
    },
    redis: {
        url: REDIS_URL
    }
};
