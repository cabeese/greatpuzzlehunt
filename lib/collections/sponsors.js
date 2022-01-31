import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { extend } from 'lodash';
import { requireAdmin, isAdmin, checkMinLength, NonEmptyString } from '../imports/method-helpers.js';

Sponsors = new Mongo.Collection('sponsors', {});

Meteor.methods({
  'sponsors.create'() {
    requireAdmin();
    const now = new Date();
    Sponsors.insert({
      name: "New Sponsor",
      level: "jigsaw",
      publish: false,
      logoUrl: null,
      createdAt: now,
      updatedAt: now,
    });
  },

  'sponsors.update'(fields) {
    check(fields, {
      _id: NonEmptyString,
      name: NonEmptyString,
      level: NonEmptyString,
      publish: Boolean,
    });
    requireAdmin();
    const { _id, name, level, publish } = fields;

    return Sponsors.update({ _id }, { $set: {
      name,
      level,
      publish,
    }});
  },

  'sponsors.updateImage'(ids) {
    check(ids, {
      sponsorId: String,
      imageUrl: String,
    });

    requireAdmin();
    if (!Meteor.isServer) return true;

    const { sponsorId, imageUrl } = ids;
    /* The image handling in mongo changed and is no longer supported with
     * the version we use with Meteor 2.5. For the time being, we'll disable
     * anything related to mongo image handling. */
    //    const image = Images.findOne({_id: imageId});
    //    const url = image.url();

    Sponsors.update({ _id: sponsorId}, { $set: {
      logoUrl: imageUrl,
    }});
  },

  'sponsors.remove'(id) {
    check(id, String);
    requireAdmin();
    const sponsor = Sponsors.findOne({ _id: id });
    Images.remove({_id: sponsor.imageId});
    Sponsors.remove({_id: id});
  },
});
