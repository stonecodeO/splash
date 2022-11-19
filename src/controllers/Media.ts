import { NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import Media from '../models/media';


const createMedia = (req: Request, res: Response, next:NextFunction) => {
    const { name, image} = req.body

    const media = new Media({
     name,
     image
    });

    return media
            .save()
            .then((media) => res.status(201).json({ media }))
            .catch((error) => res.status(500).json(error));
}

const readMedia = ((req: Request, res: Response, next:NextFunction) => {
    const mediaId = req.params.mediaId;

    return Media.findById(mediaId)
                .then((media) => res.status(200).json({media}))
                .catch((error) => res.status(500).json({ error}));
})
const readAllMedias = ((req: Request, res: Response, next:NextFunction) => {
    return Media.find()
               .then((media) => res.status(200).json(media))
               .catch((error) => res.status(500).json({error}))
})
const updateMedia = ((req: Request, res: Response, next:NextFunction) => {
    const mediaId = req.params.mediaId;

    return Media.findById(mediaId)
                .then((media) => {
                    if (media){
                        return media
                               .save()
                               .then((media) => res.status(200).json({media}))
                               .catch((error) => res.status(500).json({ error}));

                    }else{
                        res.status(404).json({message: "not found"});
                    }
                
                
                })
                .catch((error) => res.status(500).json({ error}));
})
const deleteMedia = ((req: Request, res: Response, next:NextFunction) => {
    const mediaId = req.params.mediaId;
    
    return Media.findByIdAndDelete(mediaId).then((media) => (media ? res.status(201).json({
        message: 'Deleted !'}) : res.status(404).json({message : "not found!"})))
})


export default { createMedia, readMedia, readAllMedias, updateMedia, deleteMedia}