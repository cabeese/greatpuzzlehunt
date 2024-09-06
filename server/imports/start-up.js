/*
 * Meteor Startup:
 * For running appliction startup code
*/
import { cloneDeep } from 'lodash';
import { WebApp} from 'meteor/webapp';

Meteor.startup(() => {

  if (!Meteor.isServer)
    return;

  // Check for Admin account
  let adminUser = Meteor.users.findOne({roles: 'admin', firstname: 'Noah'});

  if (adminUser === undefined) {

    if (!Meteor.settings.admin) {
      Meteor.logger.error('No "admin" object found in "Meteor.settings"');
      process.exit(1);
    }

    const adminProps = cloneDeep(Meteor.settings.admin);
    const adminId = Accounts.createUser(adminProps);
    Accounts.addEmail(adminId, Meteor.settings.admin.email, true);

    adminUser = Meteor.users.findOne({ roles: 'admin' });
    Meteor.logger.info("New Admin User: ");
    Meteor.logger.logobj(adminUser);
  }

  // include HSTS in response headers for security compliance
  WebApp.connectHandlers.use(function (req, res, next) {
    res.setHeader('Strict-Transport-Security', 'max-age=86400; includeSubDomains');
    next();
  });

  // experimental request logging
  WebApp.connectHandlers.use(function (req, res, next) {
    Meteor.logger.info("Processing request:");
    Meteor.logger.info(req.headers);
    next();
  });

  // experimental DDP connection logging
  Meteor.onConnection(function (cxn) {
    Meteor.logger.info("DDP connection made");
    Meteor.logger.info("id: " + cxn.id);
    Meteor.logger.info("address: " + cxn.clientAddress);
    Meteor.logger.logobj(cxn.httpHeaders);
  });
});
