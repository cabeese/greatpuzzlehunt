import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Tickets = new Mongo.Collection('tickets');

// Ensure index on ticket code
Meteor.startup(function () {
  if (Meteor.isServer) {
    Tickets.createIndex({ tx: 1, email: 1, code: 1 });
  }
});
