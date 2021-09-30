import { Router } from 'express'
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'


dotenv.config()

const router = Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email })
        .then((saveduser) => {
            if (saveduser) {
                return res.status(500).json({ message: "user already exists" });
            }
            else {
                bcrypt.hash(password, 10).then((hashedpassword) => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                    });

                    user
                        .save()
                        .then((user) => {
                            res.status(201).json({ message: "User saved!" });
                        })
                        .catch((err) => console.log(err));
                });
            }

        })
        .catch((err) => {
            res.status(500).json({ 'message': err });
        });
});


router.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res
                    .status(500)
                    .json({ error: "User doesn't exist please register" });
            }

            bcrypt
                .compare(password, savedUser.password)
                .then((matched) => {
                    if (matched) {
                        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET)
                        const { _id, name, email } = savedUser
                        res.json({ token, user: { _id, name, email } })
                    } else {
                        res.status(500).json({ message: "Invalid email or password" });
                    }
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => {
            res.status(500).json({ 'error': err });
        });
});

export default router;