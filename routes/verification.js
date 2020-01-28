import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../dataBase/user.js';
import { sendEmailConfirmed } from '../functions/emails.js';

const route = express.Router();

route.get('/:token', async (req, res, next) => {
    try {
        const payload = jwt.verify(req.params.token, global.jwtKey);
        await User.findByIdAndUpdate(payload.id, { $set: { veryfied: true } }, (err, doc) => {
            if (err)
                throw new Error(err.message, err);
            else {
                sendEmailConfirmed(doc.email, `${doc.name} ${doc.surname}`);
                return res.redirect("https://" + req.headers.host + "/account");
            }     
        });
    }
    catch {
        return next();
    }
});

export default route;