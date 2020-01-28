import jwt from 'jsonwebtoken';

export default (id) => {
    const token = jwt.sign({ id }, global.jwtKey, { expiresIn: '1d'});
    if (process.env.NODE_ENV === "production")
        return `http://heroku-app--------/api/emailVeryfication/${token}`
    return `http://localhost:${global.port}/api/emailVeryfication/${token}`;
} 