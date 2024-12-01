import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const RemovedUsers = new Mongo.Collection('removed_users');
