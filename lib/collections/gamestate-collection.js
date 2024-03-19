import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { requireAdmin } from '../imports/method-helpers.js';

Gamestate = new Meteor.Collection('gamestate');

Meteor.startup(() => {

  // Always ensure there is a game state and if not,
  // create the default game state ("PreGame" state)
  if (Meteor.isServer) {
    const gameState = Gamestate.findOne({});
    if (!gameState) {
      Gamestate.insert({
        gameplay: false,
        registration: true,
        leaderboard: false,
      });
    } else {
      // It exists check for sendReportsTo list
      if (!gameState.sendReportsTo) {
        Gamestate.update({_id: gameState._id}, { $set: { sendReportsTo: ["greatpuzzlehunt@gmail.com"]}});
      }
    }
  }
});

Meteor.methods({
  'admin.gamestate.toggleField'(field) {
    check(field, String);
    requireAdmin();
    const currentState = Gamestate.findOne({});
    Gamestate.update({ _id: currentState._id }, {
      $set: {
        [field]: !currentState[field],
      }
    });
  },

  'admin.gamestate.reports.addRecipient'(email) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    try{
      check(email, ValidEmail);
    } catch(e) {
      throw new Meteor.Error(400, "Invalid email");
    }

    const user = Meteor.users.findOne(this.userId);
    const currentState = Gamestate.findOne({});
    if (currentState.sendReportsTo.includes(email)){
      throw new Meteor.Error(400, 'That email is already on the list');
    }
    Gamestate.update({ _id: currentState._id }, {
      $push: {
        sendReportsTo: email
      }
    });
    Meteor.logger.info(`${user.name} added ${email} to list of nightly report recipients`);
  },

  'admin.gamestate.reports.removeRecipient'(email) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(email, String);

    const user = Meteor.users.findOne(this.userId);
    const currentState = Gamestate.findOne({});
    if (!currentState.sendReportsTo.includes(email)){
      throw new Meteor.Error(400, 'That email is not on the list');
    }

    Gamestate.update({ _id: currentState._id }, {
      $pull: {
        sendReportsTo: email
      }
    });

    Meteor.logger.info(`${user.name} removed ${email} from list of nightly report recipients`);
  },

  'admin.gamestate.setWebinarInfo'(url, id, backupURL) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(url, String);
    check(id, String);
    check(backupURL, String);

    const user = Meteor.users.findOne(this.userId);
    const currentState = Gamestate.findOne({});

    Gamestate.update({ _id: currentState._id }, {
      $set: {
        webinarURL: url,
        webinarID: id,
        livestreamBackupURL: backupURL,
      }
    });

    Meteor.logger.info(`${user.name} updated the webinar info`);
  },

  'admin.gamestate.setMessages'(m1icon, m1text, m1url, m2icon, m2text, m2url) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(m1icon, Match.Maybe(String));
    check(m1text, String);
    check(m1url, Match.Maybe(String));
    check(m2icon, String);
    check(m2text, Match.Maybe(String));
    check(m2url, Match.Maybe(String));

    const user = Meteor.users.findOne(this.userId);
    const currentState = Gamestate.findOne({});

    Gamestate.update({ _id: currentState._id }, {
      $set: {
        message1icon: m1icon,
        message1text: m1text,
        message1url: m1url,
        message2icon: m2icon,
        message2text: m2text,
        message2url: m2url
      }
    });

    Meteor.logger.info(`${user.name} updated the announcement messages`);
  },

  'admin.gamestate.setCheckinPacket'(url) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(url, String);

    const user = Meteor.users.findOne(this.userId);
    const currentState = Gamestate.findOne({});

    Gamestate.update({ _id: currentState._id }, {
      $set: {
        checkinPacketURL: url
      }
    });

    Meteor.logger.info(`${user.name} updated the checkin packet URL`);
  },
});
