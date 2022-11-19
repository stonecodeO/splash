import jwt from "jsonwebtoken";
import { config } from "../config/config"
import {Request, Response, NextFunction} from 'express';


export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader) return res.status(401).json({message: "Not allowed"})
    const token = (authHeader as string).split(' ')[1];
    jwt.verify(
        token,
        config.token.access,
        (err, decoded) => {
            if(err) return res.status(403).json({message: "forbbiden"}) // token is invalid
            //@ts-ignore
            req.user = decoded.username; 
            //@ts-ignore
            req.roles = decoded.roles;             
            next();
        }
    )
}


