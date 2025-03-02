import { Meteor } from 'meteor/meteor';

import { Invites } from '../../lib/collections/invites.js'

Meteor.publish('teams.invites', async function() {
  const { userId } = this;
  if (!userId) return this.ready();

  const user = await Meteor.users.findOneAsync({ _id: userId });
  if (!user) return this.ready();

  return Invites.find({ teamId: user.teamId });
});

Meteor.publish('invites.myInvites', async function() {
  const { userId } = this;
  if (!userId) return this.ready();

  const user = await Meteor.users.findOneAsync({ _id: userId });
  if (!user) return this.ready();

  return Invites.find({ email: user.getEmail().toLowerCase() });
});
