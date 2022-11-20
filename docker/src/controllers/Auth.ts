import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { config } from '../config/config';
import profileService from '../services/profile';
import userService from '../services/user';

const handleRegisterUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'registration failed!bad request' });
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.status(409).json({ message: 'email already used!' }); //conflict
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        //create empty profile and join to the new created username
        const profile = await profileService.createProfile({});
        //create and store the new user
        const result = await userService.createUser({
            username: username,
            email: email,
            password: hashedPwd,
            profile: profile._id
        });
        res.status(201).json({
            success: 'new user created successfully',
            user: username
        });
    } catch (err) {
        res.status(500).json({ err });
    }
};

const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'bad request!fields are missing' });
    const foundUser = await userService.findUser({ email: email });
    if (!foundUser) return res.status(401); // unauthorized request
    //evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        //create jwt token
        const accessToken = jwt.sign({ username: foundUser.username, roles: foundUser.role }, config.token.access, { expiresIn: '300s' });
        const refreshToken = jwt.sign({ username: foundUser.username, roles: foundUser.role }, config.token.refresh, { expiresIn: '1d' });
        //saving refreshToken with the current user
        foundUser.refreshToken = refreshToken;
        await userService.save(foundUser);
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 60 * 60 * 24 * 1000 });
        res.json({ accessToken });
    } else {
        res.status(401).json({ messsage: 'Unauthorized' }); // Forbidden
    }
};
const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'unauthorized' });
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.status(403).json({ message: 'forbidden' }); // forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        config.token.refresh,
        //@ts-ignore
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.status(403).json({ message: 'forbidden' });
            const accessToken = jwt.sign({ username: decoded.username, roles: decoded.roles }, config.token.access, { expiresIn: '300s' });
            res.json({ accessToken });
        }
    );
};
const handleLogout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204).json({ message: 'no content' }); // content to delete
    const refreshToken = cookies.jwt;

    // Is refreshToken in db??
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.status(403).json({ message: 'unauthorized' });
    }
    // delete refreshToken in db
    await User.updateOne({ refreshToken: refreshToken }, { $set: { refreshToken: '' } });

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true }); // secure : true - only serve on https
    res.status(200).json({ message: 'successfully logout' });
};
export default { handleRegisterUser, handleLogin, handleRefreshToken, handleLogout };
