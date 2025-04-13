import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Message } from 'semantic-ui-react';

import AdminLeaderboardTracker from './imports/AdminLeaderboardTracker';

import AdminLeaderboardMain from './imports/AdminLeaderboardMain';

let LeaderboardInternal = class LeaderboardInternal extends Component {
  render() {
    const { ready, teams, userIsAdmin } = this.props;
    if (!ready) {
      return <Loading />;
    }
    return (
      <div>
        {ready && userIsAdmin ?
         <Message info header="Stats" content={`${teams.length} teams in play.`}/>
         : null}
        <AdminLeaderboardMain userIsAdmin={userIsAdmin} teams={teams} />
      </div>
    );
  }

};

LeaderboardInternal.propTypes = {
  userIsAdmin: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(Object),
};

export default LeaderboardInternal = AdminLeaderboardTracker(LeaderboardInternal);
