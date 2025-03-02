import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Migrations } from "meteor/percolate:migrations";

import { Invites } from '../../lib/collections/invites.js'

// NOTE! Migrations are no longer run in sequence!
// This is due to the Meteor 3 transition to async/await.
// See https://github.com/percolatestudio/meteor-migrations/issues/89
Migrations.add({
  version: 5,
  up: async function () {
    const invites = await Invites.find({}).fetchAsync();
    invites.forEach(async (invite) => {
      await Invites.updateAsync(invite._id, { $set: { email: invite.email.toLowerCase() } });
    });
  },
  down: function () {
    // let's keep it this way.
  },
});
