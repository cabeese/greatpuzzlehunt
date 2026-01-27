import { Meteor } from 'meteor/meteor';
import { isAdmin, isVolunteer } from '../../lib/imports/method-helpers.js';
import moment from 'moment'

import { THCheckpoints } from '../../lib/collections/thcheckpoints.js'

Meteor.publish('admin.thcheckpoints', function() {
  return THCheckpoints.find();
});

