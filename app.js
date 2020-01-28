import Express from 'express';
import logger from './functions/logger.js';
logger.debug(`Satarting...`);

process.on('uncaughtException', (ex) => logger.error(ex.message, ex));
process.on('unhandledRejection', (ex) => logger.error(ex.message, ex));

const app = Express();

import middleware from './startup/middleware.js';
import routes from './startup/routes.js';
import mongoDB from './startup/mongoDB.js';

middleware(app);
routes(app);
mongoDB(app);

global.port = process.env.PORT || 5000;
app.listen(port, () => logger.debug(`Listening on port ${global.port}...`));