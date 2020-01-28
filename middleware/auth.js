import jwt from 'jsonwebtoken';
import logger from '../functions/logger.js';

export default function(req, res, next) {
    const token = req.header('x-auth-token');
    //1 validation: check if user send a token
    if (token) {
        //2 validation: check if token is valid
        try{
            const payload = jwt.verify(token, global.jwtKey);
            req.user = payload;
            next();
        }
        catch (er) {
            return res.status(401).send(`Invalid token. Try to log in again.`);
        }
    }
    else {
        return res.status(401).send(`Acces Denied. No token provided. Try to log in again.`);
    }
}