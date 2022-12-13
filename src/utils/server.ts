import express from 'express';
import Logger from '../library/Logger';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRoutes from '../routes/user';
import postRoutes from '../routes/post';
import mediaRoutes from '../routes/media';
import authRoutes from '../routes/auth';
import profileRoutes from '../routes/profile';
import messageRoutes from '../routes/message';
import redisCache from '../library/Cache';


const createServer = () => {
    const router = express();

    router.use((req, res, next) => {
        /** log the resquest */
        Logger.info(`Incoming::Method: [${req.method} - Url: [${req.url}] -IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the response */
            Logger.info(`OutComming::Method: [${req.method} - Url: [${req.url}] -IP: [${req.socket.remoteAddress}] - 
                Status: [${res.statusCode}]`);
        });

        /** HealtCheck  */
        router.get('/ping', (req, res, next) => {
            return res.status(200).json({ message: 'pong' });
        });

        /** Routes */
        router.use('/api/users', userRoutes);
        router.use('/api/posts', postRoutes);
        router.use('/api/medias', mediaRoutes);
        router.use('/api/auth', authRoutes);
        router.use('/api/profile', profileRoutes);
        router.use('/api/message', messageRoutes);

        /** Error handling */
        router.use((req, res, next) => {
            const error = new Error('not found');
            Logger.error(error);
            return res.status(404).json({ message: error.message });
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());
    // middleware for cookies
    router.use(cookieParser());
    router.use(express.static(path.resolve('./src/uploads/')));
    /** Rules of our Api */
    router.use((req, res, next) => {
        res.header('Access-control-Allow-Origin', '*');
        res.header('Access-control-Allow-Headers', 'Origin, X-requested-with, Content-Type, Accept, authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            return res.status(200).json();
        }
        next();
    });

    return router;
};

export default createServer;
