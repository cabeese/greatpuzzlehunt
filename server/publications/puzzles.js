import { Meteor } from 'meteor/meteor';
import { isAdmin, isVolunteer } from '../../lib/imports/method-helpers.js';
import moment from 'moment'

import { Teams } from '../../lib/collections/teams.js'
import { Puzzles } from '../../lib/collections/puzzles.js'
import { Gamestate } from '../../lib/collections/gamestate-collection.js'

const LEADERBOARD_TEAM_PROJECTION = {
  name: 1,
  hasBegun: 1,
  puzzles: 1,  // TODO: project away answer and DL link!
  members: 1,
  division: 1,
  inPerson: 1,
  finished: 1,
  prize_ineligible: 1,
}

Meteor.publish('admin.puzzles', function() {
  if (!isAdmin(this.userId)) return this.ready();
  return Puzzles.find();
});

Meteor.publish('admin.leaderboard', async function() {
  const [gamestate] = await Gamestate.find({}, { leaderboard: 1 }).fetchAsync();
  const userIsAdmin = await isAdmin(this.userId);
  if(!gamestate.leaderboard && !userIsAdmin) return this.ready();

  // Return All Users and Teams that Checked In.
  return [
    Meteor.users.find({ checkedIn: true, teamId: { $ne: null } }),
    Teams.find({ hasBegun: true },
               {fields: LEADERBOARD_TEAM_PROJECTION}),
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
