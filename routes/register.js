import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { validateBody } from '../dataBase/user.js';
import {sendVerEmail} from '../functions/emails.js';

const route = express.Router();

route.post('/', async (req, res) => {
    //1 validation: checking data syntax with hapy/joi
    const { error, value } = validateBody(req.body);
    if (error)
        return res.status(400).send(error.message);
    else {
        //2 validation: checking if data matches the DB schema
        const sameEmailUser = await User.findOne({ email: req.body.email });
        if (sameEmailUser)
            return res.status(409).send(`Email: ${req.body.email} already registerd.`);
        else {
            const salt = bcrypt.genSaltSync(15);
            value.hash = await bcrypt.hash(value.hash, salt);
            const user = new User(value);
            await user.save();
            sendVerEmail(user.email, `${user.name} ${user.surname}`, user._id);
            return res.status(201).send(`Hello ${user.name} ${user.surname}. You have been succesfully registered. Check out your email addres for verification email.`);
        }

    }
}
);

export default route;