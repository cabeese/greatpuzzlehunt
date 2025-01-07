/*
 * Meteor Startup:
 * For running appliction startup code
*/
import { cloneDeep } from 'lodash';
import { WebApp} from 'meteor/webapp';

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
});
