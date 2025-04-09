import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;

        // Extract token from request
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        // If token doesn't exist, error
        if(!token) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        // If token exist, verify it
        const decodedUser = jwt.verify(token, JWT_SECRET);

        // Find user based on Id
        const user = await User.findById(decodedUser.userId);

        if(!user){
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        // Attach user's details to request
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized', 
            error: error.message
        })
    }
};


export default authorize;