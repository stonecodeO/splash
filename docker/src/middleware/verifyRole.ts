import { Request, Response, NextFunction } from 'express';

export const verifyRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        //@ts-ignore
        if (!req?.roles) return res.status(401).json('Unauthorized no roles in req');
        const rolesArray = [...allowedRoles];
        //@ts-ignore
        const result = Object.values(req.roles)
            //@ts-ignore
            .map((role) => rolesArray.includes(role))
            .find((value) => value === true);
        if (!result) return res.status(401).json('Unauthorized  no granted');

        next();
    };
};
