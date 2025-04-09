import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js';

import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';



const app = express();

// ----------   Middleware  ----------------

// --- Express Middleware ---
app.use(express.json());                            // Parse JSON data
app.use(express.urlencoded({ extended: false }));   // Parse URL-encoded data
app.use(cookieParser());                            // Parse cookies
app.use(arcjetMiddleware);                          // routes protection through Arcjet


// --- Routes ---
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// --- Error Handling Middleware ---
app.use(errorMiddleware)

app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Tracker API Course');
});


// --- Application listening ---
app.listen(PORT, 'localhost', async () => {
  console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

  await connectToDatabase()
});

export default app;