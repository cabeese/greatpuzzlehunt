import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';

import { Gamestate } from '../../lib/collections/gamestate-collection.js'
import { Teams } from '../../lib/collections/teams.js';

export async function requireAdmin() {
  await requireAccess('admin');
}

export async function requireVolunteer() {
  await requireAccess('volunteer');
}

async function requireAccess(level) {
  const userId = Meteor.userId();
  if (!userId) {
    throw new Meteor.Error(400, 'You must be logged in');
  }

  const user = await Meteor.users.findOneAsync(userId);
  if (!user || !user.hasRole(level)) {
    throw new Meteor.Error(400, 'You do not have permission to do that!');
  }

  return userId;
}

export async function isAdmin(userId) {
  if (!userId) {
    return false;
  }

  const user = await Meteor.users.findOneAsync(userId);
  return user && user.hasRole('admin');
}

export async function isVolunteer(userId) {
  if (!userId) {
    return false;
  }

  const user = await Meteor.users.findOneAsync(userId);
  return user && user.hasRole('volunteer');
}

export function checkMinLength(length) {
  return Match.Where((x) => {
    check(x, String);
    return x.length >= length;
  });
};

export const ValidEmail = Match.Where(function(x) {
  // Originally from the froatsnook:valid-email package.
  const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return email_regex.test(x);
});

export const NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

export const ValidNameString = Match.Where(function(x) {
  check(x, String);
  return !(/[^A-Za-z0-9 !"#$%&'\(\)\*,./:;<=>\?@\[\\\]\^_\{\|\}~]/.test(x));
});

export function requirePattern(val, pattern, message) {
  const pass = Match.test(val, pattern);
  if (pass) return true;
  throw new Meteor.Error(400, message);
}

// This can only be used in Meteor Methods
export function requireUser() {
  if (!Meteor.userId()) {
    throw new Meteor.Error(403, 'You must be logged in');
  }
  return true;
}

export async function notDuringGameplay() {
  const gamestate = await Gamestate.findOneAsync();
  if (gamestate.gameplay) {
    throw new Meteor.Error(400, "Sorry, you can't do that during Gameplay!");
  }
}

export async function notAfterCheckIn() {
  const userId = await requireAccess('user');
  const team = await Teams.findOneAsync({members: userId});
  if (!team) {
    throw new Meteor.Error(400, "Error! No Team found for user!");
  }
  if (team.checkinConfirmed) {
    throw new Meteor.Error(400, "Oops! You cannot do that after check in has been confirmed!");
  }
}

export function makeName(firstname, lastname) {
  const first = firstname || "";
  const last = lastname || "";
  return `${first.charAt(0).toUpperCase()}${first.slice(1)} ${last.charAt(0).toUpperCase()}${last.slice(1)}`;
}

// Check Helpers
export const BooleanTrue = Match.Where((x) => {
  check(x, Boolean);
  return x === true;
});

export const nonDigits = /\D/g;

export const StringPhoneNumber = Match.Where((x) => {
  check(x, String);
  return x.replace(nonDigits, '').length === 10;
});

export const PositiveNumber = Match.Where((x) => {
  return parseInt(x) > 0;
});

export function checkMsg(value, pattern, message){
  if (typeof message === "undefined"){
    check(value, pattern);
  } else {
    try {
      check(value, pattern);
    } catch(e) {
      throw new Match.Error(message);
    }
  }
}
