import jwt from 'jsonwebtoken';

export default (id) => {
    const token = jwt.sign({ id }, global.jwtKey, { expiresIn: '1d'});
    if (process.env.NODE_ENV === "production")
        return `https://internet-shop-project-pk2020.herokuapp.com/api/emailVeryfication/${token}`
    return `http://localhost:${global.port}/api/emailVeryfication/${token}`;
} 