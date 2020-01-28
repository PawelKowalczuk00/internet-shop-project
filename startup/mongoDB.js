import mongoose from 'mongoose';
import logger from '../functions/logger.js';
import config from 'config';
import randomstring from 'randomstring';
if (process.env.NODE_ENV === "production")
    global.jwtKey = randomstring.generate(50);
else
    global.jwtKey = "456";

//connecting to data base globaly
export default () => {
    const connectionString = config.get('db');
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => logger.info(`Connected to ${connectionString}.`));
}
