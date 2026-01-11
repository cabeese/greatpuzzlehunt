import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';

import { Teams } from '../../../../../lib/collections/teams.js';
import { THCheckpoints } from '../../../../../lib/collections/thcheckpoints.js';

import AdminTeamTable from './AdminTeamTable';

export default AdminTeamListTracker = withTracker(() => {
  const teamHandle = Meteor.subscribe('admin.teams');
  const treasureHandle = Meteor.subscribe('admin.thcheckpoints');
  const loading = !teamHandle.ready() || !treasureHandle.ready();

  if (loading) {
    return { loading, teams: [], checkpoints: [] };
  }

  const teams = Teams.find({}).fetch();
  const checkpoints = THCheckpoints.find({}).fetch();

  return { loading, teams, teamHandle, checkpoints };
})(AdminTeamTable);
