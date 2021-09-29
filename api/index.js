import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';
import postRouter from './routes/postRouter.js';

const app = express();
dotenv.config();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);


app.listen(process.env.PORT, async () => {
    try {
        await mongoose
            .connect(process.env.CONNECTION_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        console.log("Listening at port 4000");
    } catch (error) {
        console.error(error);
    }

});
