import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { isAdmin } from '../../lib/imports/method-helpers.js';

import { GearOrders } from '../../lib/collections/gear-orders.js'
import { Tickets } from '../../lib/collections/tickets.js'
import { Transactions } from '../../lib/collections/transactions.js'

Meteor.publish('admin.transactions', function _publishAdminTransactions(search = null) {
  check(search, String);
  if (!isAdmin(this.userId)) { return this.ready(); }

  const fields = {
    tx:1, email:1, name:1, tickets: 1, createdAt:1, gear:1
  };
  const hasSearch = search && search.length > 0;

  const options = {
    fields,
  };

  let query = {};
  if (hasSearch) {
    search = search.trim();
    query = {
      $or: [
        { 'name': { $regex: search, $options: 'i' } },
        { 'email': { $regex: search, $options: 'i' } },
        { 'tx': { $eq: search } },
      ],
    };
  }

  return [
    Transactions.find(query, options),
    Tickets.find({}),
    GearOrders.find({}),
  ];
});
