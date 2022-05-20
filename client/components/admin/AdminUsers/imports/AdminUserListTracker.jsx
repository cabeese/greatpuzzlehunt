import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';

import AdminUserTable from './AdminUserTable';

export default AdminUserListTracker = withTracker(({ userSearch, teamSearch, userFilter }) => {
  const usersHandle = Meteor.subscribe('admin.users', userSearch);
  const loading = !usersHandle.ready();

  if (loading) {
    return { loading, users: [] };
  }

  const hasUserSearch = userSearch && userSearch.length > 0;

  const defaultSort = [
    ['createdAt', 'desc'],
  ];

  const options = {
    sort: defaultSort,
  };

  let query = {};
  if (hasUserSearch) {
    userSearch = userSearch.trim();
    query = {
      $or: [
        { 'firstname': { $regex: userSearch, $options: 'i' } },
        { 'lastname': { $regex: userSearch, $options: 'i' } },
        { 'emails': { $elemMatch: { address: { $regex: userSearch, $options: 'i' } } } },
      ],
    };
  }

  const teams = Teams.find({}).fetch().reduce((acc, t) => {
    acc[t._id] = t.name;
    return acc;
  }, {});

  let users = Meteor.users.find(query, options).fetch().map((u) => {
    u.teamName = u.teamId ? teams[u.teamId] : '';
    return u;
  });

  // Filter users by team name
  if (teamSearch && teamSearch.length > 0) {
    const teamSearchSafe = teamSearch.trim().toLowerCase();
    users = users.filter((user, i, _users) => (user.teamName.toLowerCase().search(teamSearchSafe) > -1));
  }
  
  // Filter users by userFilter
  for (let key in userFilter) {
    filter = userFilter[key]

    if (filter.applied) {
      users = users.filter((user, i, _users) => {
        let result = false;
        switch(key) {
          case 'verified':
            result = user.isVerified();
            break;
          case 'paid':
            result = user.paid
            break;
          case 'volunteer':
            result = user.hasRole('volunteer');
            break;
          case 'onteam':
            // TODO: !! probably not best way to get boolean
            result = !!user.teamId;
            break;
        }

        return result == filter.value;
      })
    }
  }

  return {
    loading,
    users,
    teams,
  };
})(AdminUserTable);
