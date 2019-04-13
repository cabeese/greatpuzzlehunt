import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';

import AdminTeamTable from './AdminTeamTable';

export default AdminTeamListTracker = withTracker(() => {
  const teamHandle = Meteor.subscribe('admin.teams');
  const loading = !teamHandle.ready();

  if (loading) {
    return { loading, teams: [] };
  }

  const teams = Teams.find({}).fetch();

  return { loading, teams };
})(AdminTeamTable);
