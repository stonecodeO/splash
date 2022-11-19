import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Post from '../models/post';
import postService from '../services/post'

const createpost = async (req: Request, res: Response) => {
    const { title, description, author} = req.body;
    try
    {
       let new_post = await postService.createPost({ title, description, author})
       const data = new_post.toJSON();
       res.status(201).json(data)
    }catch (err){
        res.status(500).json(err)    }
};

const readpost = (req: Request, res: Response) => {
    const postId = req.params.postId;

    return Post.findById(postId)
        .populate('author', 'medias')
        .select('-__v')
        .then((post) => res.status(200).json({ post }))
        .catch((error) => res.status(500).json({ error }));
};
const readAllposts = (req: Request, res: Response) => {
    return Post.find()
        .select('-__v')
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(500).json({ error }));
};
const updatepost = (req: Request, res: Response) => {
    const postId = req.params.postId;

    return Post.findById(postId)
        .select('-__v')
        .then((post) => {
            if (post) {
                return post
                    .save()
                    .then((post) => res.status(200).json({ post }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deletepost = (req: Request, res: Response) => {
    const postId = req.params.postId;

    return Post.findByIdAndDelete(postId)
        .select('-__v')
        .then((post) =>
            post
                ? res.status(201).json({
                      message: 'Deleted !'
                  })
                : res.status(404).json({ message: 'not found!' })
        );
};

export default { createpost, readpost, readAllposts, updatepost, deletepost };
