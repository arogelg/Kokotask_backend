import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error("Unauthorized")
        return res.status(401).json({ error: error.message })
    }

    const [,token] = bearer.split(" ")

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id email name')
            if(user){
                req.user = user
                next()
            }else{
                res.status(500).json({ error: 'Not valid token' })
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Not valid token' })
        
    }


}