import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Transactions = new Mongo.Collection('transactions');

// TODO: no index has ever been created here. Do we need one?
Meteor.startup(function () {
});
