import { Meteor } from 'meteor/meteor';
import { isAdmin, isVolunteer } from '../../lib/imports/method-helpers.js';

import { Puzzles } from '../../lib/collections/puzzles.js'
import { Teams } from '../../lib/collections/teams.js'

Meteor.publish('admin.teams', function() {
  if (!isAdmin(this.userId)) return this.ready();

  const projection = {
    createdAt: 1,
    name: 1,
    division: 1,
    checkinConfirmed: 1,
    inPerson: 1,
    playingPuzzleHunt: 1,
    playingTreasureHunt: 1,
    hasBegun: 1,
    owner: 1,
    prize_ineligible: 1,
    lookingForMembers: 1,
    EMERGENCY_LOCK_OUT: 1,
    puzzles: 1,
  }
  return Teams.find({}, {fields: projection});
});

Meteor.publish('admin.teams.export', function() {
  if (!isAdmin(this.userId)) return this.ready();

  const users = Meteor.users.find({ roles: { $nin: ['admin', 'volunteer'] } });
  const teams = Teams.find({});
  return [users, teams];
});

Meteor.publish('teams.myTeam', async function() {
  const { userId } = this;

  if (!userId) {
    return this.ready();
  }

  const user = await Meteor.users.findOneAsync(userId);
  if (!user) return this.ready();

  const userFields = {
    firstname: 1,
    lastname: 1,
    phone: 1,
    emails: 1,
    checkedIn: 1,
    paid: 1,
    teamId: 1,
  };

  let ret = [
    Teams.find({ members: userId }),
  ];
  /* There's a mongo edge case that will cause an error if the 'myTeam' service
   * is called when the current user is not on a team. It appears to be due to
   * Mongo and Meteor disagreeing on how to handle the query when `user.teamId`
   * is undefined. Thus we only run the query if the user is actually on a team.
   */
  if (user.teamId) {
    ret.push(Meteor.users.find({ teamId: user.teamId }, { fields: userFields }));
  }

  return ret
});

Meteor.publish('volunteer.team', function(teamId) {
  check(teamId, String);
  if (!isVolunteer(this.userId)) return this.ready();

  return [
    Teams.find(teamId),
    Meteor.users.find({ teamId }),
  ];
});

Meteor.publish('teams.browse', function() {
  return Teams.find({}, {
    fields: {
      name: 1,
      members: 1,
      updatedAt: 1,
      division:1,
      owner: 1,
      lookingForMembers: 1,
      inPerson: 1,
      playingPuzzleHunt: 1,
      playingTreasureHunt: 1,
    },
  });
});

Meteor.publish('game.progress', async function() {
  const { userId } = this;
  const user = await Meteor.users.findOneAsync(userId);

  const teamQuery = {
    hasBegun: true,
  };
  const teamProjection = {
    name: 1,
    members: 1,
    division: 1,
    'puzzles.puzzleId': 1,
    'puzzles.name': 1,
    'puzzles.start': 1,
    'puzzles.end': 1,
    'puzzles.score': 1,
  };

  const puzzleProjection = {
    name: 1,
    allowedTime: 1,
    location: 1,
  };

  return [
    Teams.find(teamQuery, { fields: teamProjection }),
    Puzzles.find({}, { fields: puzzleProjection }),
  ];
});

Meteor.publish('admin.team.puzzlestatus', function(teamId) {
    check(teamId, String);
    if (!isAdmin(this.userId)) {
	return this.ready();
    }

    const teamProjection = {
	// _id: 1,
	beganAt: 1,
	'puzzles.puzzleId': 1,
	'puzzles.name': 1,
	'puzzles.start': 1,
	'puzzles.end': 1,
	'puzzles.score': 1,
	'puzzles.hints': 1,
	'puzzles.tries': 1,
	'puzzles.timedOut': 1
    };
    
    return Teams.find({ '_id': teamId},
		      { fields: teamProjection });
    // return Teams.find({ '_id': teamId})
});
