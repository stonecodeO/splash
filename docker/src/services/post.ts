import Post, { IPost } from '../models/post';

const createPost = (payload: IPost) => {
    const new_post = new Post(payload);
    return new_post.save();
};

const findAllPost = () => {
    return Post.find().select(['-_id', '-__v', '-createdAt', '-updatedAt']);
};

export default {
    createPost,
    findAllPost
};
