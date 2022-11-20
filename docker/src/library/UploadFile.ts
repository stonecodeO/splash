import { Request,} from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path'

// def Types
//type DestinationCallBack = (error: Error | null, destination: string) => void
//type FileNameCallback = (error: Error | null, destination: string) => void
/** handle upload files dir */
export const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('./src/uploads'))
    },
    filename: (req, file, cb) => {
        const new_name = file.fieldname + Date.now() + file.originalname
        //@ts-ignore
        req.name = new_name
        cb(null, new_name)
    }
})
export const filesFilter = (req: Request, file: Express.Multer.File, callback:FileFilterCallback)=> {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        callback(null, true)
    }
    else if(file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv'){
        console.log('is a video file', file)
        callback(null, true)
    }
    else callback(null, false)
}
