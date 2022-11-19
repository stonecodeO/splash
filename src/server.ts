import http from 'http';
import mongoose from 'mongoose';
import Logger from './library/Logger';
import createServer from './utils/server';
import { config } from './config/config';

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logger.info('Connected to mongoDb !');
        startServer();
    })
    .catch((error) => {
        Logger.error('Unable to connect Db');
        Logger.error(error);
    });
/** Start the Web server if mongoDb's Connects */

const startServer = () => {
    const router = createServer();

    /*  const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, 'uploads',))
            },
            filename: (req, file, cb) => {
               console.log(file)
               console.log(path.join(__dirname, 'uploads',))/*'s  
               cb(null, Date.now() + path.extname(file.originalname))
            }
        })
        const upload = multer({storage})

        router.post('/upload',upload.single('avatar'), (req, res) => {

            res.status(200).json({success: "Image Uploaded"})
        }) */

    http.createServer(router).listen(config.server.port, () => Logger.info(`Server is running on port ${config.server.port}.`));
};
