import logger from '../functions/logger.js';
import mailjet from 'node-mailjet';

const mailjetClient = mailjet.connect('447d1f4b98bd50735ada4dfbc5d678c7', 'ad46e8cefc5dc494c5da010cca13c309');

export default (rec, recName, title, html) => {
  const request = mailjetClient
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": "german4050@wp.pl",
          "Name": "Internet shop (dummy site)"
        },
        "To": [
          {
            "Email": rec,
            "Name": recName
          }
        ],
        "Subject": title,
        "TextPart": title,
        "HTMLPart": html,
        "CustomID": "AppGettingStartedTest"
      }
    ]
  });
  request
    .then(result => {
      logger.debug(`Email sended to ${rec}`);
    })
    .catch(err => {
      logger.error(err.statusCode);
    });
}