import { Meteor } from 'meteor/meteor';
const parseFormdata = require("parse-formdata");

import { PostRoute } from '../imports/route-types.js';
import processTransaction from '../imports/processTransaction.js';
import { convertCashnet } from '../../lib/imports/convertCashnet';

const accts = Meteor.settings.accounts || {};
const { token } = accts;

PostRoute.route('/api/tickets', function(params, req, res, next) {
  const req_token = params.query.token;

  parseFormdata(req, function (err, data) {
    if (err) return badResponse("Unable to parse form data");
    handleRequest(req, res, req_token, data.fields);
  });
});

const badResponse = (res, message) => {
  Meteor.logger.info(`Request on "/api/tickets" with bad data`);
  body = {
    error: "Invalid data",
    details: message,
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 403;
  res.write(JSON.stringify(body));
  return res.end();
}

const handleRequest = async (req, res, req_token, body) => {
  /* Validate Token */
  if (!req_token || req_token !== token) {
    Meteor.logger.info(`Request on "/api/tickets" with BAD TOKEN: "${req_token}" from ${Meteor.logger.jstring(req.headers)}`);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 403;
    res.write('{ "error": "Invalid token" }');
    return res.end();
  }

  /* Parse request and formulate response */
  res.setHeader('Content-Type', 'application/json');

  Meteor.logger.info(`Request on "/api/tickets" from ${Meteor.logger.jstring(req.headers)}`);
  Meteor.logger.info(body); /* temp, though perhaps we should save these to the DB? */
  try {
    let txData = convertCashnet(body);
    await processTransaction(txData);
    res.statusCode = 200;
    res.end();
  } catch (err) {
    Meteor.logger.error("Failed to convert or process CashNet request");
    Meteor.logger.error(err);
    const msg = err.message || "Unknown";
    return badResponse(res, msg); /* TEMP - Prob shouldn't expose internal errors! */
  }
};
