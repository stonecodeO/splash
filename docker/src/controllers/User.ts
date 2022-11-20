import { Request, Response } from 'express';
import User from '../models/user';
import userService from '../services/user';

const readUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const foundUser = await userService.findUser({ _id: userId });
        if (!foundUser) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(foundUser);
    } catch (error) {
        return res.status(500).json({ error });
    }
};
const readAllUsers = async (req: Request, res: Response) => {
    try {
        const userList = await User.find().populate({ path: 'profile', select: ['gender', 'birthday'] });
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ error });
    }
};
const updateUser = (req: Request, res: Response) => {
    const userId = req.params.userId;

    return User.findById(userId)
        .then((user) => {
            if (user) {
                return user
                    .updateOne({ _id: user.id }, { ...req.body })
                    .then((user) => res.status(200).json({ user }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteUser = (req: Request, res: Response) => {
    const userId = req.params.userId;

    return User.findByIdAndDelete(userId).then((user) =>
        user
            ? res.status(201).json({
                  message: 'Deleted !'
              })
            : res.status(404).json({ message: 'not found!' })
    );
};

export default { readUser, readAllUsers, updateUser, deleteUser };
