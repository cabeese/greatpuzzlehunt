import { Meteor } from 'meteor/meteor';
import { map, extend } from 'lodash';

import { PostRoute } from '../imports/route-types.js';
import processTransaction from '../imports/processTransaction.js';
import { convertCashnet } from '../../lib/imports/convertCashnet';

// const { token } = Meteor.settings.accounts;
const accts = Meteor.settings.accounts || {};
const { token } = accts;

PostRoute.route('/api/tickets', function(params, req, res, next) {

  // Validate api token
  // Meteor.logger.info(`Comparing token: ${token} with params.query.token: ${params.query.token}`);
  Meteor.logger.info(`Comparing token: ${token} with params.query.token: ${req.body.token}`);

  if (!req.body.token || req.body.token !== token) {
    Meteor.logger.info(`Request on "/api/tickets" with BAD TOKEN: "${req.body.token}" from ${Meteor.logger.jstring(req.headers)}`);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 403;
    res.write('{ "error": "Invalid token" }');
    return res.end();
  }

  res.setHeader('Content-Type', 'application/json');

  Meteor.logger.info(`Request on "/api/tickets" from ${Meteor.logger.jstring(req.headers)}`);
  try {
    Meteor.logger.info(req.body)
    let txData = convertCashnet(req.body)
    processTransaction(txData);
    res.statusCode = 200;
    res.end();
  } catch (err) {
    Meteor.logger.info(`Request on "/api/tickets" with bad data`);
    res.statusCode = 403;
    res.write('{ "error": "Invalid data" }');
    Meteor.logger.info(err)
    return res.end();
  }
});
