import { Meteor } from 'meteor/meteor';
import { isAdmin, isVolunteer } from '../../lib/imports/method-helpers.js';
import moment from 'moment'

import { Puzzles } from '../../lib/collections/puzzles.js'
import { Gamestate } from '../../lib/collections/gamestate-collection.js'

Meteor.publish('admin.puzzles', function() {
  if (!isAdmin(this.userId)) return this.ready();
  return Puzzles.find();
});

Meteor.publish('admin.leaderboard', async function() {
  const [gamestate] = await Gamestate.find({}, { leaderboard: 1 }).fetchAsync();
  if(!gamestate.leaderboard && !isAdmin(this.userId)) return this.ready();

  // Return All Users and Teams that Checked In.
  return [
    Meteor.users.find({ checkedIn: true, teamId: { $ne: null } }),
    Teams.find({ hasBegun: true }),
  ];
});

Meteor.publish('volunteer.puzzles', function() {
  if (!isVolunteer(this.userId)) return this.ready();
  return [
    Puzzles.find({}, { fields: { location: 1, name: 1 } }),
    Gamestate.find({}),
  ];
});

Meteor.methods({
  serverTime: () => moment().format(),
});
