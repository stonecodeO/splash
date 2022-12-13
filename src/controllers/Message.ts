import { NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import Message, {IMessageModel} from '../models/message';
import RedisCache from '../library/Cache'

const cache = new RedisCache(3600);
const createMessage = (req: Request, res: Response) => {
    const { from, to, content} = req.body

    const msg = new Message({
     from,
     to,
     content
    });

    return msg
            .save()
            .then((msg) => res.status(201).json({ msg }))
            .catch((error) => res.status(500).json(error));
}

const readMessage = ((req: Request, res: Response) => {
    const msgId = req.params.msgId;

    return Message.findById(msgId)
                .then((msg) => res.status(200).json({msg}))
                .catch((error) => res.status(500).json({ error}));
})
const readAllMessages =(async (req: Request, res: Response) => {
    const messages = await cache.get<IMessageModel[]>('all', () => {
        // Here's the function which refreshes the cache
        return new Promise((resolve, reject) => {
            Message.find()
            .then(msgs => resolve(msgs))
            .catch(error=> reject(error))
        });
    })
    return res.status(200).json(messages);
   
})
const deleteMessage = ((req: Request, res: Response, next:NextFunction) => {
    const msgId = req.params.msgId;
    
    return Message.findByIdAndDelete(msgId).then((msg) => (msg ? res.status(201).json({
        msg: 'Deleted !'}) : res.status(404).json({msg : "not found!"})))
})


export default { createMessage, readMessage , readAllMessages, deleteMessage}