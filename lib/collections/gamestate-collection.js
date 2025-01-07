import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { requireAdmin, ValidEmail } from '../imports/method-helpers.js';

import { marked } from 'marked';

export const Gamestate = new Mongo.Collection("gamestate");

Meteor.startup(async () => {
  // Always ensure there is a game state and if not,
  // create the default game state ("PreGame" state)
  if (Meteor.isServer) {
    const gameState = await Gamestate.findOneAsync({});
    if (!gameState) {
      await Gamestate.insertAsync({
        gameplay: false,
        registration: true,
        leaderboard: false,
      });
    } else {
      // It exists check for sendReportsTo list
      if (!gameState.sendReportsTo) {
        await Gamestate.updateAsync({_id: gameState._id}, { $set: { sendReportsTo: ["greatpuzzlehunt@gmail.com"]}});
      }
    }
  }
});

Meteor.methods({
  async 'admin.gamestate.toggleField'(field) {
    check(field, String);
    requireAdmin();
    const admin = await Meteor.users.findOneAsync(this.userId);
    const currentState = await Gamestate.findOneAsync({});
    await Gamestate.updateAsync({ _id: currentState._id }, {
      $set: {
        [field]: !currentState[field],
      }
    });
    if (Meteor.isServer) {
      Meteor.logger.info(`${admin.name} set "${field}" to ${!currentState}`);
    }
  },

  async 'admin.gamestate.reports.addRecipient'(email) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    try{
      check(email, ValidEmail);
    } catch(e) {
      throw new Meteor.Error(400, "Invalid email");
    }

    const user = await Meteor.users.findOneAsync(this.userId);
    const currentState = await Gamestate.findOneAsync({});
    if (currentState.sendReportsTo.includes(email)){
      throw new Meteor.Error(400, 'That email is already on the list');
    }
    await Gamestate.updateAsync({ _id: currentState._id }, {
      $push: {
        sendReportsTo: email
      }
    });
    Meteor.logger.info(`${user.name} added ${email} to list of nightly report recipients`);
  },

  async 'admin.gamestate.reports.removeRecipient'(email) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(email, String);

    const user = await Meteor.users.findOneAsync(this.userId);
    const currentState = await Gamestate.findOneAsync({});
    if (!currentState.sendReportsTo.includes(email)){
      throw new Meteor.Error(400, 'That email is not on the list');
    }

    await Gamestate.updateAsync({ _id: currentState._id }, {
      $pull: {
        sendReportsTo: email
      }
    });

    Meteor.logger.info(`${user.name} removed ${email} from list of nightly report recipients`);
  },

  async 'admin.gamestate.setWebinarInfo'(url, id, backupURL) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(url, String);
    check(id, String);
    check(backupURL, String);

    const user = await Meteor.users.findOneAsync(this.userId);
    const currentState = await Gamestate.findOneAsync({});

    await Gamestate.updateAsync({ _id: currentState._id }, {
      $set: {
        webinarURL: url,
        webinarID: id,
        livestreamBackupURL: backupURL,
      }
    });

    Meteor.logger.info(`${user.name} updated the webinar info`);
  },

  async 'admin.gamestate.setBannerMarkdown'(markdown) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(markdown, String);

    const admin = await Meteor.users.findOneAsync(this.userId);
    const currentState = await Gamestate.findOneAsync({});
    // Throws an exception if unable to parse
    const bannerHtmlUnsanitized = marked.parse(markdown);

    await Gamestate.updateAsync({ _id: currentState._id }, {
      $set: {
        bannerMarkdown: markdown,
        bannerHtmlUnsanitized,
      }
    });

    Meteor.logger.info(`${admin.name} updated the banner markdown`);
  },

  async 'admin.gamestate.setCheckinPacket'(url) {
    requireAdmin();
    if (!Meteor.isServer) return true;
    check(url, String);

    const user = await Meteor.users.findOneAsync(this.userId);
    const currentState = await Gamestate.findOneAsync({});

    await Gamestate.updateAsync({ _id: currentState._id }, {
      $set: {
        checkinPacketURL: url
      }
    });

    Meteor.logger.info(`${user.name} updated the checkin packet URL`);
  },
});
