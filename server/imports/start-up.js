/*
 * Meteor Startup:
 * For running appliction startup code
*/
import { cloneDeep } from 'lodash';
import { WebApp} from 'meteor/webapp';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

Meteor.startup(async () => {
  if (!Meteor.isServer)
    return;

  // Check for Admin account
  let adminUser = await Meteor.users.findOneAsync({roles: 'admin', firstname: 'Noah'});

  if (adminUser === undefined) {
    if (!Meteor.settings.admin) {
      Meteor.logger.error('No "admin" object found in "Meteor.settings"');
      process.exit(1);
    }

    const adminProps = cloneDeep(Meteor.settings.admin);
    const adminId = await Accounts.createUserAsync(adminProps);
    await Accounts.addEmailAsync(adminId, Meteor.settings.admin.email, true);

    adminUser = await Meteor.users.findOneAsync({ roles: 'admin' });
    Meteor.logger.info("New Admin User: ");
    Meteor.logger.logobj(adminUser);
  }

  // include HSTS in response headers for security compliance
  WebApp.connectHandlers.use(function (req, res, next) {
    res.setHeader('Strict-Transport-Security', 'max-age=86400; includeSubDomains');
    next();
  });

  // set up rate limiting for DDP methods and subscriptions
  // This rule allows ten method calls of any kind from one IP address
  // per second
  const mruleid = DDPRateLimiter.addRule({
    type: 'method',
    clientAddress() { return true; }
  }, 10, 1000, function (data, err) {
    if (!data.allowed) {
    Meteor.logger.info('Method rate limiter rule invoked for client at ' + err.clientAddress + ' method ' + err.name);
    }
  });

  // This rule allows 1000 subscription calls of any kind from one IP
  // address per second
  const sruleid = DDPRateLimiter.addRule({
    type: 'subscription',
    clientAddress() { return true; }
  }, 100, 1000, function (data, err) {
    if (!data.allowed) {
      Meteor.logger.info('Subscription rate limiter rule invoked for client at ' + err.clientAddress + ' subscription ' + err.name);
    }
  });
});
