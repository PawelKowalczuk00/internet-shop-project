import logger from '../functions/logger.js';

export default (err, req, res, next) => {
    logger.error(logger, err);
    res.status(500).send('Something went wrong :\\');
}