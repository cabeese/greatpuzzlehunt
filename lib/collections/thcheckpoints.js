import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { requireAdmin, isAdmin, requireVolunteer, checkMinLength, NonEmptyString } from '../imports/method-helpers.js';

export const THCheckpoints = new Mongo.Collection('thcheckpoints');

Meteor.methods({
  async 'admin.thcheckpoints.create'() {
    requireAdmin();
    if (!Meteor.isServer) return;

    Meteor.logger.info('Creating new checkpoint')

    return await THCheckpoints.insertAsync({
      name: 'New Checkpoint',
      sequence: 0,
      startDescription: '',
      finishDescription: '',
      codewords: []
    });
  },

  async 'admin.thcheckpoints.update'(checkpointid, fields) {
    check(checkpointid, String);
    check(fields, {
      name: String,
      sequence: Number
    });

    requireAdmin();
    if (!Meteor.isServer) return;

    Meteor.logger.info('Updating checkpoint')

    // Make sure this checkpoint exists.
    const checkpoint = await THCheckpoints.findOneAsync(checkpointid);
    if (!checkpoint) throw new Meteor.Error(400, `No checkpoint with id ${checkpointid} was found!`);

    return await THCheckpoints.updateAsync(checkpointid, {
      $set: fields,
    });
  },

  async 'admin.thcheckpoints.delete'(checkpointid) {
    check(checkpointid, String);

    requireAdmin();
    if (!Meteor.isServer) return;

    Meteor.logger.info('Deleting checkpoint')

    // Make sure this checkpoint exists.
    const checkpoint = await THCheckpoints.findOneAsync(checkpointid);
    if (!checkpoint) throw new Meteor.Error(400, `No checkpoint with id ${fields._id} was found!`);

    // Remove checkpoint
    return await THCheckpoints.removeAsync(checkpointid);
  }
});
