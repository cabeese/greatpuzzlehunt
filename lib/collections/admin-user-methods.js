import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import _ from 'lodash';

import { requireAdmin, isAdmin, ValidEmail,
  NonEmptyString, StringPhoneNumber, PositiveNumber,
  makeName
} from '../imports/method-helpers.js';
import { getFormError } from './users';
import { gameModeEnum } from '../imports/util';

import { Teams } from './teams.js';
import { RemovedUsers } from './removed-users.js';

import { Invites } from './invites.js';

const USERNAME_MIN_LENGTH = 4;
const PASSWORD_MIN_LENGTH = 6;

function checkUserData(data) {
  try {
    check(data, {
      _id: NonEmptyString,
      firstname: NonEmptyString,
      lastname: NonEmptyString,
      email: ValidEmail,
      accountType: Match.OneOf('STUDENT', 'NONSTUDENT', 'VOLUNTEER'),
      gameMode: Match.OneOf(...gameModeEnum),
      phone: StringPhoneNumber,
      age: PositiveNumber,
      address: NonEmptyString,
      city: NonEmptyString,
      zip: NonEmptyString,
      state: NonEmptyString,
      country: NonEmptyString,
      ecName: NonEmptyString,
      ecRelationship: NonEmptyString,
      ecPhone: StringPhoneNumber,
      ecEmail: ValidEmail,
      parentGuardian: String,
      photoPermission: Boolean,
      playingTreasureHunt: Boolean,
      playingPuzzleHunt: Boolean
    });
  } catch (ex) {
    throw getFormError(ex);
  }
};

function checkUserEmailData(data) {
  try {
    check(data, {
      userId: NonEmptyString,
      newEmail: ValidEmail,
    });
  } catch (ex) {
    throw getFormError(ex);
  }
};

// User collections methods:
Meteor.methods({

  async 'admin.user.update'(userData) {
    checkUserData(userData);
    requireAdmin();

    if (!Meteor.isServer) return true;

    Meteor.logger.info(
      `Admin User modified user account for ${userData.email}`);

    const userFields = _.omit(userData, "email");

    await Meteor.users.updateAsync(userFields._id, { $set: userFields } );
  },

  async 'admin.user.updateEmail'(userEmailData) {
    checkUserEmailData(userEmailData);
    requireAdmin();

    if (Meteor.isClient) return;
    const { userId, newEmail } = userEmailData;

    const user = await Meteor.users.findOneAsync(userId);
    if (!user) throw new Meteor.Error(400, 'User not found!');

    const existingUser = await Accounts.findUserByEmail(newEmail);
    if (existingUser && existingUser._id !== user._id) {
      throw new Meteor.Error(400, 'A user with that email already exists!');
    }

    // Exit if no change
    const currentEmail = user.getEmail();
    if (user.isVerified() && currentEmail === newEmail) return true;
    Meteor.logger.info(`Admin changed user's email from ${currentEmail} to ${newEmail}`);

    try {
      await Accounts.addEmailAsync(user._id, newEmail);
      Accounts.removeEmail(userId, currentEmail);
      Accounts.sendVerificationEmail(userId, newEmail);
    } catch(error) {
      Meteor.logger.error("Failed to change email for user. This email may already be in use");
      Meteor.logger.error(error);
      return false;
    }

    return true;
  },

  async 'admin.user.emailResend'(userId) {
    check(userId, String);
    requireAdmin();

    if (!Meteor.isServer) return true;

    const user = await Meteor.users.findOneAsync(userId);
    if (!user) throw new Meteor.Error(400, 'No user found!');

    Meteor.logger.info(`Try to send email to ${user._id} (${userId})`);
    try {
      const ret = await Accounts.sendVerificationEmail(user._id, user.email);
    } catch(error) {
      Meteor.logger.error(`Failed to re-send verification email: ${error}`);
      throw new Meteor.Error(500, `Failed to sendVerificationEmail: ${error}`);
    }
    return true;
  },

  async 'admin.user.resetPassword'(fields) {
    check(fields, {
      _id: String
    });

    requireAdmin();

    if (Meteor.isServer) {
      const origUser = await Meteor.users.findOneAsync({_id: fields._id});
      if (!origUser) {
        throw new Meteor.Error(400, 'No user by that id was found!');
      }

      Accounts.sendResetPasswordEmail(origUser._id);
    }
  },

  async 'admin.user.delete'(userId) {
    check(userId, String);
    requireAdmin();
    if (!Meteor.isServer) return true;

    const user = await Meteor.users.findOneAsync(userId);
    if (!user) throw new Meteor.Error(400, 'No user found!');

    if (user.teamId) {
      const team = await Teams.findOneAsync(user.teamId);
      if (team.members.length === 1) {
        await Teams.removeAsync(team._id);
        await Invites.removeAsync({ teamId: team._id });
      } else if (user._id === team.owner) {
        const newOwner = _.head(_.filter(team.members, (u) => u !== user._id));
        await Teams.updateAsync(user.teamId, {
          $pull: { members: user._id },
          $set: { owner: newOwner },
        });
      } else {
        await Teams.updateAsync(user.teamId, { $pull: { members: user._id } });
      }
    }
    await RemovedUsers.insertAsync(user);
    await Meteor.users.removeAsync(user._id);
  },

  async 'admin.user.toggleRole'(userId, role) {
    check(userId, String);
    check(role, String);
    requireAdmin();
    if (!Meteor.isServer) return true;

    const user = await Meteor.users.findOneAsync(userId);
    if (!user) throw new Meteor.Error(400, `No user with id ${fields._id} was found!`);
    if (this.userId === userId && role === 'admin' && user.hasRole('admin')) throw new Meteor.Error(400, 'You cannot remove yourself from admin');

    const action = user.hasRole(role) ? '$pull' : '$push';
    await Meteor.users.updateAsync(user._id, { [action]: { roles: role } });
  },

  async 'admin.user.togglePaid'(userId) {
    check(userId, String);
    requireAdmin();
    if (!Meteor.isServer) return true;

    const user = await Meteor.users.findOneAsync(userId);
    if (!user) throw new Meteor.Error(400, `No user with id ${fields._id} was found!`);

    const newPaid = !user.paid;
    await Meteor.users.updateAsync(user._id, { $set: { paid: newPaid } });
  },

  async 'admin.validateUser'(userId) {
    check(userId, String);
    requireAdmin();

    if (!Meteor.isServer) return true;

    const user = await Meteor.users.findOneAsync(userId);
    if (!user) throw new Meteor.Error(400, 'No user Found');

    await Meteor.users.updateAsync(user._id, {
      $set: {
        'emails.0.verified': true,
      }
    });
  },

  async 'admin.user.setTeam'(userId, teamId){
    check(userId, String);
    check(teamId, String);
    requireAdmin();

    if (!Meteor.isServer) return true;

    if(teamId === "") teamId = null;

    const user = await Meteor.users.findOneAsync(userId);
    if (!user) throw new Meteor.Error(400, 'No user Found');
    const userName = `${user.firstname} ${user.lastname}`;

    const newTeam = await Teams.findOneAsync(teamId);
    if (teamId && !newTeam) throw new Meteor.Error(400, 'No team Found');

    const oldTeam = await Teams.findOneAsync(user.teamId);
    if (oldTeam && oldTeam.owner === userId) throw new Meteor.Error(400, "Cannot change team owner!");

    if(newTeam && newTeam.members.length >= 6) throw new Meteor.Error(400, "Team already full");

    if(user.teamId){
      /* Remove the user from their existing team */
      Meteor.logger.info(`Admin: Removing ${userName} from team ${user.teamId}`);
      await Teams.updateAsync(user.teamId, { $pull: { members: userId } } );
    }

    if(teamId){
      /* Add user to a team */
      Meteor.logger.info(`Admin: Adding ${userName} to team ${teamId}`);
      await Teams.updateAsync(teamId, { $push: { members: user._id },
                                        $set: { updatedAt: new Date() } });
      await Meteor.users.updateAsync(user._id, { $set: { teamId: teamId } });
    } else {
      /* User will no longer be on a team */
      await Meteor.users.updateAsync(user._id, { $unset: { teamId: null }})
    }
  },

});
