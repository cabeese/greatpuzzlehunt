import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Header,
  Segment,
  Message
} from 'semantic-ui-react';

import AdminLeaderboardTracker from './imports/AdminLeaderboardTracker';
import AdminLeaderboardMain from './imports/AdminLeaderboardMain';
import GamestateComp from '../../imports/GamestateComp';
import { isAdmin } from '../../../../lib/imports/method-helpers';

const thinSegmentStyle = {
  marginBottom: '-40px',
  paddingLeft: '28px',
};

AdminLeaderboard = class AdminLeaderboard extends Component {
  render() {
    const { teams, ready, gamestate, user } = this.props;
    const userIsAdmin = this._userIsAdmin();
    const content = this._getContent();
    return (
      <Container fluid>
        <Segment basic style={thinSegmentStyle}>
          <Header as="h2" content="Leader Board"/>
          {ready && userIsAdmin ?
           <Message info header="Stats" content={`${teams.length} teams in play.`}/>
           : null}
          {content}
        </Segment>
      </Container>
    );
  }

  _userIsAdmin() {
    const { user } = this.props;
    // Note: in some cases, the user object may be only partially
    // populated and will be missing the 'roles' array. In this case,
    // we may get a false negative (i.e. admin marked as non-admin)
    // when the page first loads. This is likely not a concern,
    // however, because this check is only used to reveal a few
    // low-impact things, and the component will likely be refreshed
    // with an updated 'user' object almost immediately anyways.
    return !!(user && user.hasRole('admin'));
  }

  _getContent() {
    const { ready, user, teams, gamestate } = this.props;
    const isLeaderboardReady = ready ? gamestate.leaderboard : false;
    const userIsAdmin = this._userIsAdmin();
    if (ready && (isLeaderboardReady || userIsAdmin)) {
      return <AdminLeaderboardMain userIsAdmin={userIsAdmin} teams={teams} />;
    } else if (ready && !userIsAdmin) {
      return <Message info content={'Leaderboard is not available yet.'} />;
    } else {
      return <Loading/>;
    }
  }
}

AdminLeaderboard.propTypes = {
  ready: PropTypes.bool.isRequired,
  user: PropTypes.object,
  teams: PropTypes.arrayOf(Object),
  gamestate: PropTypes.object,
};

AdminLeaderboard = AdminLeaderboardTracker(GamestateComp(AdminLeaderboard));
