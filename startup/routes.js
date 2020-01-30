import logger from '../functions/logger.js';
import path from 'path';
//routes
import register from '../routes/register.js';
import login from '../routes/login.js';
import account from '../routes/account.js';
import products from '../routes/products.js';
import buy from '../routes/buy.js';
import sell from '../routes/sell.js';
import verification from '../routes/verification.js'

//middleware routes
import auth from '../middleware/auth.js';
import errorRoute from '../middleware/error.js';

export default (app) => {
    logger.debug('Importing routes');
    //common routes:
    app.use('/api/register', register);
    app.use('/api/login', login);
    app.use('/api/products', products);
    app.use('/api/emailVeryfication', verification);

    //protected routes:
    app.use('/api/account', auth, account);
    app.use('/api/buy', auth, buy);
    app.use('/api/sell', auth, sell);

    //unknown url path - works only in production mode
    app.get('*', (req,res) => {     
        res.redirect("https://internet-shop-project-pk2020.herokuapp.com/");
    });

    //error route
    app.use(errorRoute);
}
