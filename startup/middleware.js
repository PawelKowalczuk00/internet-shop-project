import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import logger from '../functions/logger.js';
import httpsOnly from '../middleware/httpsOnly.js';

export default (app) => {
    logger.debug('Using middleware');
    app.use(cors({
        origin: true, allowedHeaders: 'content-length, content-type, x-auth-token',
        exposedHeaders: ['x-auth-token', 'x-id'], credentials: true
    }));
    app.options('*', cors());
    if (process.env.NODE_ENV == 'production') {
        helmet.referrerPolicy({ policy: 'origin' });
        app.use(helmet());
        app.use(express.static('./client/build'));
        app.use(httpsOnly);
        logger.debug('Using production.');
    }
    else {
        const morganFormat = 'tiny';
        app.use(morgan(morganFormat)); 
        logger.debug(`Using development morgan-${morganFormat}.`);
    }
    app.use(express.json());
}
