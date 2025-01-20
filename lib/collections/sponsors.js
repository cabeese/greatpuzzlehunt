import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { extend } from 'lodash';
import { requireAdmin, isAdmin, checkMinLength, NonEmptyString } from '../imports/method-helpers.js';

export const Sponsors = new Mongo.Collection('sponsors');

Meteor.methods({
  async 'sponsors.create'() {
    requireAdmin();
    const now = new Date();
    await Sponsors.insertAsync({
      name: "New Sponsor",
      level: "jigsaw",
      publish: false,
      logoUrl: null,
      createdAt: now,
      updatedAt: now,
    });
  },

  async 'sponsors.update'(fields) {
    check(fields, {
      _id: NonEmptyString,
      name: NonEmptyString,
      level: NonEmptyString,
      publish: Boolean,
    });
    requireAdmin();
    const { _id, name, level, publish } = fields;

    return await Sponsors.updateAsync({ _id }, { $set: {
      name,
      level,
      publish,
    }});
  },

  async 'sponsors.updateImage'(ids) {
    check(ids, {
      sponsorId: String,
      imageUrl: String,
    });

    requireAdmin();
    if (!Meteor.isServer) return true;

    const { sponsorId, imageUrl } = ids;

    await Sponsors.updateAsync({ _id: sponsorId}, { $set: {
      logoUrl: imageUrl,
    }});
  },

  async 'sponsors.remove'(id) {
    check(id, String);
    requireAdmin();
    await Sponsors.removeAsync({_id: id});
  },
});
