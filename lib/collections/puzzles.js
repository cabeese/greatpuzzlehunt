import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { requireAdmin, isAdmin, requireVolunteer, checkMinLength, NonEmptyString } from '../imports/method-helpers.js';

export const Puzzles = new Mongo.Collection('puzzles');

Meteor.methods({
  async 'admin.puzzle.create'() {
    requireAdmin();
    if (!Meteor.isServer) return;

    return await Puzzles.insertAsync({
      name: 'New Puzzle',
      stage: 0,
      answer: '',
      allowedTime: 70,
      timeoutScore: 105,
      bonusTime: 10,
      location: '',
      downloadURL: '',
      hints: [
        {
          text: '',
          imageUrl: '',
        },
        {
          text: '',
          imageUrl: '',
        },
        {
          text: '',
          imageUrl: '',
        },
      ],
      triggerCodewords: "",
      triggerHintImageURL: "",
    });
  },

  async 'admin.puzzle.update'(puzzleId, fields) {
    check(puzzleId, String);
    check(fields, {
      name: String,
      stage: Number,
      answer: String,
      allowedTime: Number,
      timeoutScore: Number,
      bonusTime: Number,
      location: String,
      downloadURL: String,
      hints: [Object],
      triggerCodewords: String,
      triggerHintImageURL: String,
    });

    requireAdmin();
    if (!Meteor.isServer) return;

    // Make sure this puzzle exists.
    const puzzle = await Puzzles.findOneAsync(puzzleId);
    if (!puzzle) throw new Meteor.Error(400, `No puzzle with id ${puzzleId} was found!`);

    return await Puzzles.updateAsync(puzzleId, {
      $set: fields,
    });
  },

  async 'admin.puzzle.delete'(puzzleId) {
    check(puzzleId, String);

    requireAdmin();
    if (!Meteor.isServer) return;

    // Make sure this puzzle exists.
    const puzzle = await Puzzles.findOneAsync(puzzleId);
    if (!puzzle) throw new Meteor.Error(400, `No puzzle with id ${fields._id} was found!`);

    // Remove puzzle
    return await Puzzles.removeAsync(puzzleId);
  },

  async 'volunteer.setPuzzleStation'(puzzleId) {
    check(puzzleId, String);
    if (puzzleId.length <= 0) throw new Meteor.Error(400, `Puzzle id given is blank!`);

    requireVolunteer();
    const { userId } = this;
    if (Meteor.isClient) return true;

    return await Meteor.users.updateAsync({_id: userId },
                                          { $set: { puzzleStation: puzzleId } });
  }
});
