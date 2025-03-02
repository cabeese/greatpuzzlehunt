import { Meteor } from 'meteor/meteor';

import processTransaction from '../imports/processTransaction.js';
import { convertCashnet } from '../../lib/imports/convertCashnet';
import bodyParser from "body-parser";

const accts = Meteor.settings.accounts || {};
const { token } = accts;

WebApp.connectHandlers.use("/api", bodyParser.urlencoded({ extended: true }));
WebApp.connectHandlers.use('/api/tickets', async (req, res, next) => {
  Meteor.logger.info(`Request on "/api/tickets" from ${Meteor.logger.jstring(req.headers)}`);
  const req_token = req.query.token;

  await handleRequest(req, res, req_token, req.body);
});

const handleRequest = async (req, res, req_token, body) => {
  Meteor.logger.info("Logging raw transaction");
  Meteor.logger.info(body);
  res.setHeader('Content-Type', 'application/json');
  /* Validate Token */
  if (!req_token || req_token !== token) {
    Meteor.logger.info(`Request on "/api/tickets" with BAD TOKEN: "${req_token}" from ${Meteor.logger.jstring(req.headers)}`);
    res.statusCode = 403;
    res.write('{ "error": "Invalid token" }');
    return res.end();
  }

  /* Parse request and formulate response */
  try {
    let txData = convertCashnet(body);
    await processTransaction(txData);
    res.statusCode = 200;
    res.end();
  } catch (err) {
    Meteor.logger.error("Failed to convert or process CashNet request");
    Meteor.logger.error(err);
    const msg = "Unable to parse request";
    return badResponse(res, msg);
  }
};

const badResponse = (res, message) => {
  Meteor.logger.info(`Request on "/api/tickets" with bad data`);
  const body = {
    error: "Invalid data",
    details: message,
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 403;
  res.write(JSON.stringify(body));
  return res.end();
}
