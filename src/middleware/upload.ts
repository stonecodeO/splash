import {Request, Response, NextFunction} from 'express'
const multer  = require("multer");
import { fileStorage, filesFilter } from '../library/UploadFile';

export const uploadFileMid = multer({storage: fileStorage, fileFilter: filesFilter}).single('avatar')


