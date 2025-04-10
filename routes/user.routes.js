import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js'
import { getUser, getUsers } from '../controllers/user.controller.js';



const userRouter = Router();

// Get all users from db
userRouter.get('/', getUsers);

// Get a User based on their "id"
userRouter.get('/:id', authorize, getUser);


userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE a user'}));


userRouter.delete('/:id', (req, res) => res.send({title: 'DELETE a user'}));



export default userRouter;