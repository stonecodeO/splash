import User from '../models/user';
import mongoose, { FilterQuery, QueryOptions } from 'mongoose';
import { IUserModel } from '../models/user';

const createUser = (payload: { email: String; password: String; username: String; profile: mongoose.Types.ObjectId }) => {
    return User.create(payload);
};

const findAllUser = () => {
    return User.find().select(['-_id', '-__v', '-createdAt', '-updatedAt']);
};
const findUser = (query: FilterQuery<IUserModel>, options: QueryOptions = { lean: true }) => {
    return User.findOne(query, {}, options);
};

const save = (user: mongoose.Document<IUserModel>) => {
    return user.save();
};

export default {
    createUser,
    findAllUser,
    findUser,
    save
};
