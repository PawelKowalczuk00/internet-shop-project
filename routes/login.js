import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../dataBase/user.js';
import jwt from 'jsonwebtoken';

const route = express.Router();

route.post('/', async (req, res) => {
    //1 validation: checking if email is in data base
    //try catch is managed with 'express-async-errors'
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        //3 validation: checking if password matches the email
        const isPasswordValid = await bcrypt.compare(req.body.hash, user.hash);
        if (isPasswordValid) {
            //Creating JSON web token
            const token = user.generateAuthToken();
            user.logHistory.push(Date.now());
            await user.save();
            res.setHeader('x-id', user._id);
            res.header('x-auth-token', token).send(`Hello ${user.name} ${user.surname}.`);
        }
        else
            res.status(401).send(`Incorrect password`);
    }
    else
        res.status(400).send(`User ${req.body.email} not found`);
}
);

export default route;