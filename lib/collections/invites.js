import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { findIndex } from 'lodash';
import moment from 'moment';

import { requireUser, notAfterCheckIn, ValidEmail } from '../imports/method-helpers.js';
import { emailTeamInvite } from '../imports/emails.js';

export const Invites = new Mongo.Collection('invites');

/*
Structure of a TeamInvite:

{
  _id: String,
  teamId: String,
  email: String,
  invitedBy: {
    _id: String,
    name: String,
  },
  accepted: Boolean,

}
*/

Meteor.methods({
  async 'teams.inviteMember'(team, email) {
    check(team, Object);
    try {
      check(email, ValidEmail);
    }
    catch (ex) {
      throw new Meteor.Error(400, 'You must enter a valid email address!');
    }

    requireUser();
    notAfterCheckIn();

    const user = await Meteor.users.findOneAsync({ _id: this.userId });
    if (!user.teamId) {
      throw new Meteor.Error(400, 'You must be on a team to invite people!');
    } else if (user.teamId !== team._id) {
      throw new Meteor.Error(400, 'You can only invite members to your team!');
    }

    // Only send and create invite on the server.
    if (!Meteor.isServer) return true;

    // Check team size limit
    const teamInvites = await Invites.find({
      teamId: user.teamId, accepted: false })
          .fetchAsync();
    const existingIndex = findIndex(teamInvites, { email });

    if ((existingIndex === -1) && (teamInvites.length + team.members.length >= 6)) {
      throw new Meteor.Error(400, 'Teams can only have up to 6 members!');
    }

    const now = new Date();
    await Invites.upsertAsync({
      teamId: user.teamId,
      email,
    },
    {
      teamId: user.teamId,
      teamName: team.name,
      email,
      invitedBy: {
        _id: user._id,
        name: user.name,
      },
      updatedAt: now,
      accepted: false,
    });

    this.unblock();

    if (existingIndex === -1 || moment(teamInvites[existingIndex].updatedAt).isBefore(moment(now).subtract({ minutes: 5}))) {
      await emailTeamInvite(team, user, email);
    }

  },

  async 'teams.deleteInvite'(team, email) {
    check(team, Object);
    check(email, String);

    requireUser();

    const user = await Meteor.users.findOneAsync({ _id: this.userId });
    if (!user.teamId) {
      throw new Meteor.Error(400, 'You must be on a team to invite people!');
    } else if (user.teamId !== team._id) {
      throw new Meteor.Error(400, 'You can only invite members to your team!');
    }

    return await Invites.removeAsync({ teamId: user.teamId, email, accepted: false });
  },

  async 'invites.accept'(invite) {
    check(invite, Object);

    requireUser();
    const user = await Meteor.userAsync();
    if (user.getEmail() !== invite.email) {
      throw new Meteor.Error(400, 'This invite does not belong to you!');
    }
    if (user.teamId) {
      throw new Meteor.Error(400, 'You are already on a team!');
    }

    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(invite.teamId);
    if (!team) {
      throw new Meteor.Error(400, 'Oops, this team no longer exists!');
    }
    if (team.members.length >= 6) {
      throw new Meteor.Error(400, 'Oops, this team is already full!');
    }
    if (team.checkinConfirmed) {
      throw new Meteor.Error(400, "Oops, this team has already been checked in!");
    }

    // Great join the team.
    await Meteor.users.updateAsync({ _id: user._id }, { $set: { teamId: team._id }});
    await Teams.updateAsync({ _id: team._id }, { $push: { members: user._id }});
    await Invites.updateAsync({ _id: invite._id }, { $set: { accepted: true }});
  }

});
